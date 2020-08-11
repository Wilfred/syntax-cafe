import React, { useState } from "react";

const MIN_LENGTH = 1;

// Ensure that inputs are not empty, and only call onChange for valid
// inputs. Highlight invalid inputs.
const RequiredTextInput: React.FC<{
  value: string;
  placeholder: string;
  onChange: (_: string) => void;
  validator?: (_: string) => boolean;
}> = ({ value, placeholder, onChange, validator }) => {
  const [actualValue, setActualValue] = useState(value);

  let isValid = (s: string) => s != "";
  if (validator) {
    isValid = validator;
  }

  let className = "input";
  if (!isValid(actualValue)) {
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
        if (isValid(value)) {
          onChange(value);
        }
      }}
    />
  );
};
export default RequiredTextInput;
