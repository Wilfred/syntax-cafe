import React, { useState } from "react";

// Ensure that inputs are not empty, and only call onChange for valid
// inputs. Highlight invalid inputs.
const RequiredTextInput: React.FC<{
  minLength: number;
  value: string;
  placeholder: string;
  onChange: (_: string) => void;
}> = ({ minLength, value, placeholder, onChange }) => {
  minLength = minLength || 1;
  const [actualValue, setActualValue] = useState(value);

  let className = "input";
  if (actualValue.length < minLength) {
    className += " is-danger";
  }

  return (
    <input
      className={className}
      type="text"
      placeholder={placeholder}
      value={actualValue}
      onChange={(e) => {
        const value = e.target.value;
        setActualValue(value);
        if (value.length >= minLength) {
          onChange(value);
        }
      }}
    />
  );
};
export default RequiredTextInput;
