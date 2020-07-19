import React, { useState } from "react";

const MIN_LENGTH = 1;

// Ensure that inputs are not empty, and only call onChange for valid
// inputs. Highlight invalid inputs.
const RequiredTextInput: React.FC<{
  value: string;
  placeholder: string;
  onChange: (_: string) => void;
}> = ({ value, placeholder, onChange }) => {
  const [actualValue, setActualValue] = useState(value);

  let className = "input";
  if (actualValue.length < MIN_LENGTH) {
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
        if (value.length >= MIN_LENGTH) {
          onChange(value);
        }
      }}
    />
  );
};
export default RequiredTextInput;
