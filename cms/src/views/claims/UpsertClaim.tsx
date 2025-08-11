import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClaimConfigResponseDto,
  StepsDto,
  ClaimConfigConfigDto,
  CreateClaimRequestDto,
  UpdateClaimRequestDto,
  ClaimDto,
} from "../../types";
import { CONFIG_STORAGE_KEY } from "../../utils";
import {
  createClaim,
  fetchClaim,
  fetchConfig,
  updateClaim,
} from "../../services";
import AttributeRendererComponent from "../../components/AttributeRendererComponent";
import { PATHS } from "../../routes/paths";

const UpsertClaim = () => {
  const { id } = useParams<{ id?: string }>();
  const [config, setConfig] = useState<ClaimConfigResponseDto | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    attributes: {},
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isUpdate = Boolean(id);

  useEffect(() => {
    if (isUpdate) {
      // Load existing claim data if updating
      const loadClaimData = async () => {
        setLoading(true);
        try {
          await fetchClaim(id as string)
            .then((response) => {
              setFormData(response.claim as ClaimDto);
              setStepIndex(0); // Reset to first step
            })
            .catch((error) => {
              throw new Error(error.message || "Failed to fetch claim data");
            });
        } catch (error: any) {
          alert("Error fetching claim data: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      loadClaimData();
    }
  }, [isUpdate, id]);

  useEffect(() => {
    const sanitizeConfig = (config: ClaimConfigResponseDto) => {
      if (!isUpdate) {
        config.data.forEach((step) => {
          Object.keys(step.configs).forEach((key) => {
            //!Note: Not recommended in real world apps, but for demo purposes and because this has been assumed to be fixed
            //! we could add hideIf formula to the config for better and reliable control
            if (step.configs[key]?.key === "status") {
              delete step.configs[key];
            }
          });
        });
      }
      return config;
    };

    const getConfig = async () => {
      try {
        const configAttr = localStorage.getItem(CONFIG_STORAGE_KEY);
        let parsedConfig: ClaimConfigResponseDto | null = null;

        if (configAttr) {
          parsedConfig = sanitizeConfig(JSON.parse(configAttr));
          setConfig(parsedConfig);
          return;
        }
        setLoading(true);
        const res = await fetchConfig();
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(res));
        parsedConfig = sanitizeConfig(res);
        setConfig(parsedConfig);
      } catch (error: any) {
        console.error("Error fetching configuration:", error);
        alert(`Error fetching configuration: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getConfig();
  }, [isUpdate, setConfig, setLoading]);

  if (!config) return <div>Loading...</div>;
  if (!config.data?.length) return <div>No steps configured.</div>;

  const steps = config.data as StepsDto[];
  const currentStep = steps[stepIndex];

  const handleFieldChange = (
    fieldKey: string,
    value: any,
    isFixed?: boolean
  ) => {
    setFormData((prev) => {
      if (!prev) return prev; // Prevent updating if prev is undefined

      if (isFixed) {
        // Save at root level
        return {
          ...prev,
          [fieldKey]: value,
        };
      } else {
        // Save inside attributes
        return {
          ...prev,
          attributes: {
            ...prev.attributes,
            [fieldKey]: value,
          },
        };
      }
    });
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const isLastStep = stepIndex === steps.length - 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUpdate) {
      await createClaim(formData as CreateClaimRequestDto)
        .then((res) => {
          alert(res.message || "Claim created successfully!");
          navigate(PATHS.CLAIMS);
        })
        .catch((error) => {
          alert(
            "Error creating claim: " +
              error.message +
              JSON.stringify(error.errors, null, 2)
          );
        });
    } else {
      await updateClaim(id as string, formData as UpdateClaimRequestDto)
        .then((res) => {
          alert(res.message || "Claim updated successfully!");
          navigate(PATHS.CLAIMS);
        })
        .catch((error) => {
          alert(
            "Error updating claim: " +
              error.message +
              JSON.stringify(error.errors, null, 2)
          );
        });
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span onClick={() => navigate(-1)} className="cursor-pointer pr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </span>{" "}
        {isUpdate ? "Update Claim" : "Create Claim"}
      </h2>
      <div className="mb-6 flex gap-2">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className={`px-4 py-2 rounded-full text-sm font-semibold
              ${
                idx === stepIndex
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }
            `}
          >
            {step.title}
          </div>
        ))}
      </div>
      <form className="space-y-6">
        <h3 className="text-lg font-semibold mb-2">{currentStep.title}</h3>
        <p className="mb-4 text-gray-500">{currentStep.description}</p>
        {Object.entries(
          currentStep.configs as Record<string, ClaimConfigConfigDto>
        ).map(([key, field]) => (
          <div key={field.key}>
            <AttributeRendererComponent
              container={
                currentStep?.fixed
                  ? (formData as Record<string, any>) || {}
                  : (formData?.attributes as Record<string, any>) || {}
              }
              configDef={{
                ...field,
                onValueChange: (e) =>
                  handleFieldChange(key, e.target.value, currentStep?.fixed),
              }}
            />
          </div>
        ))}
      </form>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
        >
          Back
        </button>
        <button
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? handleSubmit : handleNext}
          className={`px-4 py-2 rounded ${
            isLastStep ? "bg-green-600" : "bg-blue-600"
          } text-white font-semibold`}
        >
          {!isLastStep ? "Next" : isUpdate ? "Update Claim" : "Create Claim"}
        </button>
      </div>
    </div>
  );
};

export default UpsertClaim;
