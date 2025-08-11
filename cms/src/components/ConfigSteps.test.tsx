import { render, screen, fireEvent } from "@testing-library/react";
import ConfigSteps from "./ConfigSteps";
import { ClaimConfigResponseDto } from "../types";

// Mock dnd-kit useSortable
jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
}));

const step = { title: "Step 1", fixed: false, configs: {} };
const fixedStep = { title: "Step 2", fixed: true, configs: {} };
const config = { data: [step, fixedStep] } as ClaimConfigResponseDto;

describe("ConfigSteps", () => {
  it("renders step title and drag handle", () => {
    render(
      <ConfigSteps
        step={step}
        selectedStep={null}
        setSelectedStep={jest.fn()}
        handleRemoveStep={jest.fn()}
        config={config}
      />
    );
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByTitle("Drag to reorder")).toBeInTheDocument();
  });

  it("highlights selected step", () => {
    render(
      <ConfigSteps
        step={step}
        selectedStep={step}
        setSelectedStep={jest.fn()}
        handleRemoveStep={jest.fn()}
        config={config}
      />
    );
    // eslint-disable-next-line testing-library/no-node-access
    const btn = screen.getByText("Step 1").closest("button");
    expect(btn).toHaveClass("bg-blue-200");
  });

  it("calls setSelectedStep when step button is clicked", () => {
    const setSelectedStep = jest.fn();
    render(
      <ConfigSteps
        step={step}
        selectedStep={null}
        setSelectedStep={setSelectedStep}
        handleRemoveStep={jest.fn()}
        config={config}
      />
    );
    fireEvent.click(screen.getByText("Step 1"));
    expect(setSelectedStep).toHaveBeenCalledWith(step);
  });

  it("calls handleRemoveStep when remove button is clicked", () => {
    const handleRemoveStep = jest.fn();
    render(
      <ConfigSteps
        step={step}
        selectedStep={null}
        setSelectedStep={jest.fn()}
        handleRemoveStep={handleRemoveStep}
        config={config}
      />
    );
    fireEvent.click(screen.getByTitle("Remove step"));
    expect(handleRemoveStep).toHaveBeenCalledWith("Step 1");
  });

  it("hides remove button for fixed step", () => {
    render(
      <ConfigSteps
        step={fixedStep}
        selectedStep={null}
        setSelectedStep={jest.fn()}
        handleRemoveStep={jest.fn()}
        config={config}
      />
    );
    const removeBtn = screen.getByTitle("Remove step");
    expect(removeBtn).toHaveClass("hidden");
  });

  it("disables remove button if only one step in config", () => {
    render(
      <ConfigSteps
        step={step}
        selectedStep={null}
        setSelectedStep={jest.fn()}
        handleRemoveStep={jest.fn()}
        config={
          {
            data: [step],
            message: "Only one step allowed",
          } as ClaimConfigResponseDto
        }
      />
    );
    const removeBtn = screen.getByTitle("Remove step");
    expect(removeBtn).toBeDisabled();
  });
});
