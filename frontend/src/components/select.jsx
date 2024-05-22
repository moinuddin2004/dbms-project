import React, { useId } from "react";
import { forwardRef } from "react";

function Select({ label, options, className, ...props }, ref) {
  const id = useId();

  return (
    <div>
      {label && <label htmlFor={id}></label>}
      {
        <select>
          {options.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      }
    </div>
  );
}

export default forwardRef(Select);
