import { ClaimConfigConfigDto, FieldOptionDto } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const renderType = [
  "text",
  "number",
  "select",
  "checkbox",
  "radio",
  "date",
  "datetime-local",
  "email",
  "textarea",
  "time",
];
interface IAttributeConfigurationProps {
  configKey: string;
  field: ClaimConfigConfigDto;
  openConfigs: Record<string, boolean>;
  toggleConfig: (key: string) => void;
  handleFieldChange: (
    key: string,
    field: keyof ClaimConfigConfigDto,
    value: any,
    nestedKey?: string
  ) => void;
  handleRemoveConfig: (key: string) => void;
  handleAddOption: (key: string) => void;
  handleOptionChange: (
    key: string,
    index: number,
    field: keyof FieldOptionDto,
    value: string
  ) => void;
  handleRemoveOption: (key: string, index: number) => void;
  readOnly?: boolean; // Optional prop to indicate if the component is read-only
}

const AttributeConfiguration = (props: IAttributeConfigurationProps) => {
  const {
    configKey,
    field,
    toggleConfig,
    openConfigs,
    handleRemoveConfig,
    handleFieldChange,
    handleOptionChange,
    handleAddOption,
    handleRemoveOption,
    readOnly,
  } = props;
  const [hasDependency, setHasDependency] = useState(
    !!field.dependsOn?.key && !!field.dependsOn?.value
  );
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: configKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={configKey}
      className="border-b pb-2 mb-1"
      style={style}
      {...attributes}
      ref={setNodeRef}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex w-full justify-between py-2 px-2 rounded bg-gray-100 hover:bg-gray-200 font-semibold text-left"
          onClick={() => toggleConfig(configKey)}
        >
          <div>
            <span
              {...listeners}
              className="cursor-grab active:cursor-grabbing pr-3"
            >
              ⠿
            </span>
            <span>{field.label || configKey}</span>
          </div>
          <div>
            <span className="ml-2 text-xl">
              {openConfigs[configKey] ? "−" : "+"}
            </span>
          </div>
        </button>
        <button
          type="button"
          disabled={readOnly}
          className="ml-2 text-red-500 hover:text-red-700 font-bold"
          title="Remove config"
          onClick={() => handleRemoveConfig(configKey)}
        >
          ×
        </button>
      </div>
      {openConfigs[configKey] && (
        <div className="mt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Label *</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={field.label}
                required
                readOnly={readOnly}
                onChange={(e) =>
                  handleFieldChange(configKey, "label", e.target.value)
                }
              />
            </div>
            <div>
              <label
                title="Input key must be alphanumeric and can include underscores only."
                className="block text-sm font-medium"
              >
                <span className="text-white bg-blue-500 rounded-full mr-2 w-4 h-4 cursor-pointer">
                  &#x2139;
                </span>{" "}
                Key *
              </label>
              <input
                className="w-full border rounded px-2 py-1"
                value={field.key}
                required
                pattern="^[A-Za-z0-9_]+$"
                readOnly={readOnly}
                onChange={(e) =>
                  handleFieldChange(configKey, "key", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Placeholder</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={field.placeholder || ""}
                readOnly={readOnly}
                onChange={(e) =>
                  handleFieldChange(configKey, "placeholder", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Default Value</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={field.defaultValue || ""}
                readOnly={readOnly}
                onChange={(e) =>
                  handleFieldChange(configKey, "defaultValue", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Validation formula
              </label>
              <input
                type="text"
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={field.validation}
                onChange={() =>
                  handleFieldChange(configKey, "validation", false)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                className="block text-sm font-medium"
                title="Depends on key and value to show this field only when the condition is met"
              >
                <span className="text-white bg-blue-500 rounded-full mr-2 w-4 h-4 cursor-pointer">
                  &#x2139;
                </span>{" "}
                Has dependency
              </label>
              <input
                type="checkbox"
                disabled={readOnly}
                checked={hasDependency}
                onChange={() => setHasDependency((prev) => !prev)}
              />
            </div>
            <div className={`${!hasDependency ? "hidden" : ""}`}>
              <label
                className="block text-sm font-medium"
                title="The exact key of the attribute that this field depends on"
              >
                <span className="text-white bg-blue-500 rounded-full mr-2 w-4 h-4 cursor-pointer">
                  &#x2139;
                </span>
                Depends on key
              </label>

              <input
                type="text"
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={field.dependsOn?.key || ""}
                onChange={(e) =>
                  handleFieldChange(
                    configKey,
                    "dependsOn" as keyof ClaimConfigConfigDto,
                    e.target.value,
                    "key"
                  )
                }
              />
            </div>
            <div className={`${!hasDependency ? "hidden" : ""}`}>
              <label
                className="block text-sm font-medium"
                title="The exact value of the attribute that this field depends on"
              >
                <span className="text-white bg-blue-500 rounded-full mr-2 w-4 h-4 cursor-pointer">
                  &#x2139;
                </span>
                Depends on Value
              </label>

              <input
                type="text"
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={field.dependsOn?.value || ""}
                onChange={(e) => {
                  handleFieldChange(
                    configKey,
                    "dependsOn" as keyof ClaimConfigConfigDto,
                    e.target.value,
                    "value"
                  );
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Required</label>
              <div className="flex gap-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    disabled={readOnly}
                    className="form-radio"
                    checked={field.required === true}
                    onChange={() =>
                      handleFieldChange(configKey, "required", true)
                    }
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    disabled={readOnly}
                    className="form-radio"
                    checked={field.required === false}
                    onChange={() =>
                      handleFieldChange(configKey, "required", false)
                    }
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Type *</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={field.type}
                required
                disabled={readOnly}
                onChange={(e) =>
                  handleFieldChange(configKey, "type", e.target.value)
                }
              >
                {renderType.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Editable options for specific type */}
          {(field.type === "select" || field.type === "radio") && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                <span
                  title="Input key must be alphanumeric and can include underscores only."
                  className="text-white bg-blue-500 rounded-full mr-2 w-4 h-4 cursor-pointer"
                >
                  &#x2139;
                </span>
                Options
              </label>
              {field.options?.map((option, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Value"
                    readOnly={readOnly}
                    value={option.value}
                    pattern="^[A-Za-z0-9_]+$"
                    required
                    onChange={(e) =>
                      handleOptionChange(
                        configKey,
                        idx,
                        "value",
                        e.target.value
                      )
                    }
                  />
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Label"
                    value={option.label}
                    readOnly={readOnly}
                    required
                    onChange={(e) =>
                      handleOptionChange(
                        configKey,
                        idx,
                        "label",
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    disabled={readOnly}
                    className="text-red-500 font-bold px-2"
                    onClick={() => handleRemoveOption(configKey, idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                disabled={readOnly}
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleAddOption(configKey)}
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttributeConfiguration;
