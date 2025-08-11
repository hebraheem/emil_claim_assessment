import { render, screen, fireEvent } from "@testing-library/react";
import AttributeRendererComponent, {
  IAttributes,
} from "./AttributeRendererComponent";

const baseConfig: IAttributes = {
  id: "test_id",
  key: "test",
  label: "Test Label",
  type: "text",
  required: true,
  options: [],
  defaultValue: "",
  placeholder: "Enter value",
};

describe("AttributeRendererComponent", () => {
  it("renders a text input and label", () => {
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent
        configDef={baseConfig}
        container={container}
      />
    );
    expect(screen.getByTestId("test")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });

  it("calls onValueChange and updates container on input change", () => {
    const onValueChange = jest.fn();
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent
        configDef={{ ...baseConfig, onValueChange }}
        container={container}
      />
    );
    const input = screen.getByPlaceholderText("Enter value");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onValueChange).toHaveBeenCalled();
    expect(container.test).toBe("abc");
  });

  it("renders a select input for type select", () => {
    const config = {
      ...baseConfig,
      type: "select",
      options: [
        { value: "v1", label: "Option 1" },
        { value: "v2", label: "Option 2" },
      ],
    };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders a checkbox for type checkbox", () => {
    const config = { ...baseConfig, type: "checkbox" };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders radio buttons for type radio", () => {
    const config = {
      ...baseConfig,
      type: "radio",
      options: [
        { value: "v1", label: "Radio 1" },
        { value: "v2", label: "Radio 2" },
      ],
    };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByLabelText("Radio 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Radio 2")).toBeInTheDocument();
  });

  it("renders a textarea for type textarea", () => {
    const config = { ...baseConfig, type: "textarea" };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders a date input for type date", () => {
    const config = { ...baseConfig, type: "date" };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByTestId("test")).toHaveAttribute("type", "date");
  });

  it("hides the field if dependsOn is not met", () => {
    const config = {
      ...baseConfig,
      dependsOn: { key: "other", value: "yes" },
    };
    const container: Record<string, any> = { other: "no" };
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.queryByLabelText("Test Label")).not.toBeInTheDocument();
  });

  it("shows the field if dependsOn is met", () => {
    const config = {
      ...baseConfig,
      dependsOn: { key: "other", value: "yes" },
    };
    const container: Record<string, any> = { other: "yes" };
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(screen.getByTestId("test")).toBeInTheDocument();
  });

  it("initializes with defaultValue if provided", () => {
    const onValueChange = jest.fn();
    const config = { ...baseConfig, defaultValue: "foo", onValueChange };
    const container: Record<string, any> = {};
    render(
      <AttributeRendererComponent configDef={config} container={container} />
    );
    expect(container.test).toBe("foo");
    expect(onValueChange).toHaveBeenCalled();
  });
});
