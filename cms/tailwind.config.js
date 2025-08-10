const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        "input[readonly], select[readonly]": {
          borderColor: "transparent",
          boxShadow: "none",
          backgroundColor: "#F3F4F6",
          cursor: "not-allowed",
          pointerEvents: "none",
        },
        "input[readonly]:focus, select[readonly]:focus": {
          borderColor: "transparent",
          boxShadow: "none",
          outline: "none",
        },
        "button[disabled]": {
          cursor: "not-allowed",
          opacity: "0.5",
          pointerEvents: "none",
        },
        "input:required:valid": {
          borderColor: "green",
        },
        "input:required:invalid": {
          borderColor: "red",
        },
        "select:required:invalid": {
          borderColor: "#DC2626",
        },
        "select:required:valid": {
          borderColor: "green",
        },
        "input[type='radio']:required:invalid": {
          outline: "2px solid #DC2626",
        },
        "input[type='radio']:required:valid": {
          outline: "2px solid green",
        },
        "input[type='radio'][data-readonly]": {
          pointerEvents: "none",
          cursor: "not-allowed",
        },
      });
    }),
  ],
};
