import React, { useEffect, useState } from "react";
import {
  ClaimConfigResponseDto,
  StepsDto,
  ClaimConfigConfigDto,
  FieldOptionDto,
} from "../types";
import { fetchConfig, updateConfig } from "../services";
import { CONFIG_STORAGE_KEY } from "../utils/constant";
import AttributeConfiguration from "../components/AttributeConfiguration";
import { sortObjectsByOrderingNumber } from "../utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ConfigSteps from "../components/ConfigSteps";

const generateConfigId = () =>
  `config_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

const Config = () => {
  const [config, setConfig] = useState<ClaimConfigResponseDto>();
  const [selectedStep, setSelectedStep] = useState<StepsDto | null>(null);
  const [editedConfig, setEditedConfig] = useState<
    Record<string, ClaimConfigConfigDto>
  >({});
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [openConfigs, setOpenConfigs] = useState<Record<string, boolean>>({});
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getConfig = async () => {
      const localConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (localConfig) {
        const parsed = JSON.parse(localConfig);
        setConfig(parsed);
        if (parsed?.data?.length) setSelectedStep(parsed.data[0]);
        return;
      }
      try {
        const response = await fetchConfig();
        setConfig(response);
        if (response?.data?.length) setSelectedStep(response.data[0]);
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(response));
      } catch (error: any) {
        alert("Error fetching configuration: " + error.message);
      }
    };
    getConfig();
  }, [updated]);

  useEffect(() => {
    if (selectedStep) {
      setEditedConfig({ ...selectedStep.configs });
      setEditedTitle(selectedStep.title);
      setEditedDescription(selectedStep.description as string);
      // Open all configs by default when step changes
      const openState: Record<string, boolean> = {};
      Object.keys(selectedStep.configs).forEach((key) => {
        openState[key] = false;
      });
      setOpenConfigs(openState);
    }
  }, [selectedStep]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFieldChange = (
    key: string,
    field: keyof ClaimConfigConfigDto,
    value: any
  ) => {
    setEditedConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleOptionChange = (
    key: string,
    idx: number,
    field: keyof FieldOptionDto,
    value: string
  ) => {
    setEditedConfig((prev) => {
      const options = prev[key].options ? [...prev[key].options] : [];
      options[idx] = { ...options[idx], [field]: value };
      return {
        ...prev,
        [key]: {
          ...prev[key],
          options,
        },
      };
    });
  };

  const handleAddOption = (key: string) => {
    setEditedConfig((prev) => {
      const options = prev[key].options ? [...prev[key].options] : [];
      options.push({ value: "", label: "" });
      return {
        ...prev,
        [key]: {
          ...prev[key],
          options,
        },
      };
    });
  };

  const handleRemoveOption = (key: string, idx: number) => {
    setEditedConfig((prev) => {
      const options = prev[key].options ? [...prev[key].options] : [];
      options.splice(idx, 1);
      return {
        ...prev,
        [key]: {
          ...prev[key],
          options,
        },
      };
    });
  };

  const handleAddConfig = () => {
    const newConfigId = generateConfigId();
    setEditedConfig((prev) => ({
      ...prev,
      [newConfigId]: {
        id: newConfigId,
        key: newConfigId,
        label: "New Config " + (Object.keys(prev).length + 1),
        type: "text",
        options: [],
        defaultValue: "",
        placeholder: "",
        required: false,
        dependsOn: { key: "", value: "" },
        orderingNumber: Object.keys(prev).length + 1,
      },
    }));
    setOpenConfigs((prev) => ({
      ...prev,
      [newConfigId]: true,
    }));
  };

  // Remove a config from the current step
  const handleRemoveConfig = (configKey: string) => {
    setEditedConfig((prev) => {
      const updated = { ...prev };
      delete updated[configKey];
      return updated;
    });
    setOpenConfigs((prev) => {
      const updated = { ...prev };
      delete updated[configKey];
      return updated;
    });
  };

  // Handle drag and drop reordering for attribute config
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Get the sorted keys by orderingNumber
    const sortedEntries = Object.entries(
      sortObjectsByOrderingNumber(editedConfig)
    );
    const keys = sortedEntries.map(([key]) => key);

    const oldIndex = keys.indexOf(active.id);
    const newIndex = keys.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reorder the keys
    const newKeys = arrayMove(keys, oldIndex, newIndex);

    // Build a new config object with updated orderingNumber
    const newConfig: typeof editedConfig = {};
    newKeys.forEach((key, idx) => {
      newConfig[key] = {
        ...editedConfig[key],
        orderingNumber: idx + 1,
      };
    });

    setEditedConfig(newConfig);
  };

  const sortStepsByOrderingNumber = (steps: StepsDto[]) =>
    [...steps].sort(
      (a, b) => (a.orderingNumber || 0) - (b.orderingNumber || 0)
    );

  // Handle drag and drop reordering for steps
  const handleStepDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !config) return;

    const sortedSteps = sortStepsByOrderingNumber(config.data);
    const keys = sortedSteps.map((step) => step.title); // or step.id if available

    const oldIndex = keys.indexOf(active.id);
    const newIndex = keys.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSteps = arrayMove(sortedSteps, oldIndex, newIndex).map(
      (step, idx) => ({
        ...step,
        orderingNumber: idx + 1,
      })
    );

    setConfig({ ...config, data: newSteps });
  };

  const handleSave = async () => {
    if (!selectedStep || !config) return;
    const updatedSteps = config.data.map((step) =>
      step.title === selectedStep.title
        ? {
            ...step,
            title: editedTitle,
            description: editedDescription,
            configs: editedConfig,
          }
        : step
    );
    setLoading(true);
    await updateConfig({ request: updatedSteps })
      .then((response) => {
        if (response) {
          localStorage.removeItem(CONFIG_STORAGE_KEY);
          setUpdated(true);
        }
      })
      .catch((error) => {
        alert("Error updating configuration:" + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleConfig = (key: string) => {
    setOpenConfigs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Add a new step
  const handleAddStep = () => {
    if (!config) return;
    const newStep: StepsDto = {
      title: "New Step " + (config.data.length + 1),
      description: "",
      orderingNumber: config.data.length + 1,
      configs: {
        [generateConfigId()]: {
          id: generateConfigId(),
          key: generateConfigId(),
          label: "New Config",
          type: "text",
          options: [],
          orderingNumber: 1,
        },
      },
    };
    const updatedSteps = [...config.data, newStep];
    const updatedConfig = { ...config, data: updatedSteps };
    setConfig(updatedConfig);
    setSelectedStep(newStep);
  };

  // Remove a step
  const handleRemoveStep = (stepId: string) => {
    if (!config) return;
    const updatedSteps = config.data.filter((step) => step.title !== stepId);
    const updatedConfig = { ...config, data: updatedSteps };
    setConfig(updatedConfig);
    // If the removed step was selected, select the first step or null
    if (selectedStep?.title === stepId) {
      setSelectedStep(updatedSteps[0] || null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6">
        {/* Steps Sidebar */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleStepDragEnd}
        >
          <aside className="w-64 p-4">
            <h3 className="font-bold text-lg mb-4 text-blue-700">Steps</h3>
            <SortableContext
              items={sortStepsByOrderingNumber(config?.data || []).map(
                (step) => step.title
              )}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {sortStepsByOrderingNumber(config?.data || []).map(
                  (step: StepsDto) => (
                    <ConfigSteps
                      key={step.title}
                      step={step}
                      selectedStep={selectedStep}
                      setSelectedStep={setSelectedStep}
                      handleRemoveStep={handleRemoveStep}
                      config={config}
                    />
                  )
                )}
              </ul>
            </SortableContext>
            <button
              className="w-full text-left px-3 py-2 mt-4 rounded-lg transition font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700"
              type="button"
              onClick={handleAddStep}
            >
              + Add new step
            </button>
          </aside>
        </DndContext>

        {/* Config Editor */}
        <section className="flex-1 p-3">
          {selectedStep ? (
            <React.Fragment>
              <h2 className="text-2xl font-bold mb-4">{editedTitle}</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-6"
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Step Title *
                  </label>
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editedTitle}
                    required
                    readOnly={selectedStep?.fixed}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Step Description *
                  </label>
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editedDescription}
                    required
                    readOnly={selectedStep?.fixed}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  disabled={selectedStep?.fixed}
                  className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded"
                  onClick={handleAddConfig}
                >
                  + Add Config
                </button>
                <SortableContext
                  items={Object.values(
                    sortObjectsByOrderingNumber(selectedStep.configs)
                  ).map((item) => item.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {Object.entries(
                    sortObjectsByOrderingNumber(editedConfig)
                  ).map(([key, field]) => (
                    <AttributeConfiguration
                      key={key}
                      configKey={key}
                      readOnly={selectedStep?.fixed}
                      field={field}
                      toggleConfig={toggleConfig}
                      openConfigs={openConfigs}
                      handleRemoveConfig={handleRemoveConfig}
                      handleFieldChange={handleFieldChange}
                      handleOptionChange={handleOptionChange}
                      handleAddOption={handleAddOption}
                      handleRemoveOption={handleRemoveOption}
                    />
                  ))}
                </SortableContext>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {!loading ? "Save" : "Saving..."}
                </button>
              </form>
            </React.Fragment>
          ) : (
            <div className="text-gray-500">
              Select a step to edit its configuration.
            </div>
          )}
        </section>
      </div>
    </DndContext>
  );
};

export default Config;
