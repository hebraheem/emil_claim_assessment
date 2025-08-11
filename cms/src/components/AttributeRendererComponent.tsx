import { useEffect, useState } from "react";
import { FieldOptionDto, ClaimConfigConfigDto } from "../types";

export interface IAttributes extends ClaimConfigConfigDto {
  onValueChange?: (e: any) => unknown;
  labelClass?: string;
  valueClass?: string;
}

const AttributeRendererComponent = ({
  configDef,
  container,
}: {
  configDef: IAttributes;
  container: Record<string, any>;
}) => {
  const {
    key,
    onValueChange,
    type,
    label,
    labelClass = "block text-sm font-medium",
    valueClass = "w-full border rounded px-2 py-1",
    options = [] as FieldOptionDto[],
  } = configDef;
  const [hidden, setHidden] = useState<Record<string, any>>({});

  const value = container[key] || "";

  useEffect(
    // Initialize the attribute with default value if it exists
    () => {
      if (configDef.defaultValue && !container[key]) {
        container[key] = configDef.defaultValue;
        onValueChange?.({ target: { value: configDef.defaultValue } });
      }
    },
    // eslint-disable-next-line
    []
  );

  const dependsOnValue = configDef.dependsOn?.key
    ? container[configDef.dependsOn.key]
    : undefined;

  useEffect(() => {
    // Handle visibility based on dependsOn condition
    if (configDef?.dependsOn && configDef.dependsOn.key) {
      const dependsKey = configDef.dependsOn.key;
      const dependsValue = configDef.dependsOn.value;

      const isVisible = container[dependsKey] === dependsValue;

      setHidden((prev) => ({ ...prev, [key]: !isVisible }));

      if (!isVisible) {
        // Reset value if hidden
        if (container[key]) {
          container[key] = "";
          onValueChange?.({ target: { value: "" } });
        }
      }
    } else {
      setHidden((prev) => ({ ...prev, [key]: false }));
    }
    // eslint-disable-next-line
  }, [configDef.dependsOn, dependsOnValue]);

  const renderAttribute = () => {
    switch (type) {
      case "text":
      case "number":
        return (
          <input
            className={valueClass}
            value={value}
            data-testid={key}
            type={type}
            required={configDef.required}
            placeholder={configDef.placeholder || ""}
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
      case "select":
        return (
          <select
            className={valueClass}
            value={value}
            required={configDef.required}
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          >
            <option value=""></option>
            {options.map(({ value, label }, indx) => (
              <option key={indx} value={value}>
                {label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            className={valueClass}
            data-testid={key}
            type="checkbox"
            required={configDef.required}
            checked={value}
            onChange={(e) => {
              container[key] = e.target.checked;
              onValueChange?.(e);
            }}
          />
        );
      case "radio":
        return (
          <div className={`flex gap-2 ${hidden[key] ? "hidden" : ""}`}>
            {options.map(({ value, label }, indx) => (
              <label key={indx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={key}
                  required={configDef.required}
                  value={value}
                  checked={value === container[key]}
                  onChange={(e) => {
                    container[key] = e.target.value;
                    onValueChange?.(e);
                  }}
                />
                {label}
              </label>
            ))}
          </div>
        );
      case "textarea":
        return (
          <textarea
            className={valueClass}
            value={value}
            data-testid={key}
            required={configDef.required}
            placeholder={configDef.placeholder || ""}
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
      case "date":
        return (
          <input
            className={valueClass}
            value={value}
            data-testid={key}
            required={configDef.required}
            type="date"
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
      case "datetime-local":
        return (
          <input
            className={valueClass}
            value={value}
            data-testid={key}
            required={configDef.required}
            type="datetime-local"
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
      case "time":
        return (
          <input
            className={valueClass}
            value={value}
            data-testid={key}
            type="time"
            required={configDef.required}
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
      default:
        return (
          <input
            className={valueClass}
            value={value}
            data-testid={key}
            type="text"
            required={configDef.required}
            placeholder={configDef.placeholder || ""}
            onChange={(e) => {
              container[key] = e.target.value;
              onValueChange?.(e);
            }}
          />
        );
    }
  };

  // don't render if the attribute is hidden
  if (hidden[key]) return null;

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {renderAttribute()}
    </div>
  );
};

export default AttributeRendererComponent;
