import React, { useState } from "react";

// Ensure that inputs are not empty, and only call onChange for valid
// inputs. Highlight invalid inputs.
export default function RequiredTextInput(props) {
  const minLength = props.minLength || 1;
  const [actualValue, setActualValue] = useState(props.value);

  let className = "input";
  if (actualValue.length < minLength) {
    className += " is-danger";
  }

  return (
    <input
      className={className}
      type="text"
      placeholder={props.placeholder}
      value={actualValue}
      onChange={e => {
        const value = e.target.value;
        setActualValue(value);
        if (value.length >= minLength) {
          props.onChange(value);
        }
      }}
    />
  );
}
