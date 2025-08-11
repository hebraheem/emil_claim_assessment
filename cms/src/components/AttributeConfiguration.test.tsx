import { render, screen, fireEvent } from "@testing-library/react";
import AttributeConfiguration from "./AttributeConfiguration";
import { ClaimConfigConfigDto } from "../types";

// Mock dnd-kit hooks/utilities
jest.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => "" } },
}));

const baseField: ClaimConfigConfigDto = {
  id: "test_id",
  key: "test_key",
  label: "Test Label",
  type: "text",
  required: true,
  options: [],
  defaultValue: "",
  placeholder: "",
  validation: "",
  dependsOn: undefined,
};

describe("AttributeConfiguration", () => {
  const props = {
    configKey: "test_key",
    field: baseField,
    openConfigs: { test_key: true },
    toggleConfig: jest.fn(),
    handleFieldChange: jest.fn(),
    handleRemoveConfig: jest.fn(),
    handleAddOption: jest.fn(),
    handleOptionChange: jest.fn(),
    handleRemoveOption: jest.fn(),
    readOnly: false,
  };

  it("calls toggleConfig when header button is clicked", () => {
    render(<AttributeConfiguration {...props} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(props.toggleConfig).toHaveBeenCalledWith("test_key");
  });

  it("calls handleRemoveConfig when remove button is clicked", () => {
    render(<AttributeConfiguration {...props} />);
    fireEvent.click(screen.getByTitle(/Remove config/i));
    expect(props.handleRemoveConfig).toHaveBeenCalledWith("test_key");
  });

  it("calls handleFieldChange when label input changes", () => {
    render(<AttributeConfiguration {...props} />);
    fireEvent.change(screen.getByTestId("label"), {
      target: { value: "New Label" },
    });
    expect(props.handleFieldChange).toHaveBeenCalledWith(
      "test_key",
      "label",
      "New Label"
    );
  });

  it("shows options section for select type", () => {
    const selectField = {
      ...baseField,
      type: "select",
      options: [{ value: "v1", label: "L1" }],
    };
    render(<AttributeConfiguration {...props} field={selectField} />);
    expect(screen.getByText(/Options/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Value/i)).toHaveValue("v1");
    expect(screen.getByPlaceholderText(/Label/i)).toHaveValue("L1");
  });

  it('calls handleAddOption when "+ Add Option" is clicked', () => {
    const selectField = { ...baseField, type: "select", options: [] };
    render(<AttributeConfiguration {...props} field={selectField} />);
    fireEvent.click(screen.getByText(/\+ Add Option/i));
    expect(props.handleAddOption).toHaveBeenCalledWith("test_key");
  });

  it("disables inputs when readOnly is true", () => {
    render(<AttributeConfiguration {...props} readOnly={true} />);
    expect(screen.getByTitle(/Remove config/i)).toBeDisabled();
  });

  it("shows dependency fields when hasDependency is true", () => {
    const depField = {
      ...baseField,
      dependsOn: { key: "depKey", value: "depValue" },
    };
    render(<AttributeConfiguration {...props} field={depField} />);
    expect(screen.getByTestId("hasDependency")).toBeChecked();
    expect(screen.getByTestId("dependsOnValue")).toBeInTheDocument();
    expect(screen.getByTestId("dependsOnKey")).toBeInTheDocument();
  });
});
