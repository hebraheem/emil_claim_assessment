import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { ClaimConfigResponseDto, StepsDto } from "../types";

interface IConfigStepsProps {
  step: StepsDto;
  selectedStep: StepsDto | null;
  setSelectedStep: (step: StepsDto) => void;
  handleRemoveStep: (title: string) => void;
  config: ClaimConfigResponseDto | undefined;
}
const ConfigSteps = ({
  step,
  selectedStep,
  setSelectedStep,
  handleRemoveStep,
  config,
}: IConfigStepsProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.title });
  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
  };
  return (
    <li
      key={step.title}
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center"
    >
      <button
        className={`flex-1 text-left px-3 py-2 rounded-lg transition font-semibold ${
          selectedStep?.title === step.title
            ? "bg-blue-200 text-blue-900"
            : "bg-blue-50 hover:bg-blue-100 text-blue-700"
        }`}
        onClick={() => setSelectedStep(step)}
      >
        <span
          {...listeners}
          className="cursor-grab pr-2"
          title="Drag to reorder"
        >
          ⠿
        </span>
        {step.title}
      </button>
      <button
        className={`ml-2 text-red-500 hover:text-red-700 font-bold ${
          step?.fixed ? "hidden" : ""
        }`}
        title="Remove step"
        onClick={() => handleRemoveStep(step.title)}
        disabled={config?.data.length === 1}
        type="button"
      >
        ×
      </button>
    </li>
  );
};

export default ConfigSteps;
