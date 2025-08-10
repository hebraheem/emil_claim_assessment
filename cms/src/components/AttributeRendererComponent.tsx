import React from "react";
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

  const value = container[key] || "";
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {type !== "select" ? (
        <input
          className={valueClass}
          value={value}
          id={key}
          type={type}
          onChange={(e) => {
            container[key] = e.target.value;
            onValueChange?.(e);
          }}
        />
      ) : (
        <select
          className={valueClass}
          value={value}
          onChange={(e) => {
            container[key] = e.target.value;
            onValueChange?.(e);
          }}
        >
          {options.map(({ value, label }) => (
            <option key={type} value={value}>
              {label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AttributeRendererComponent;
