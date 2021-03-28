import React from 'react';

/**
 * Implements the simplest shape of ChangeEvent we require to update prop variant.
 * The only thing we need is value.
 */
export type OnChangeEventLike = {
  target: {
    value: string
  }
}

export type ShowcaseSelectProps<TypeOfValue extends string> = {
  value: TypeOfValue;
  options: TypeOfValue[];
  setValue: (newValue: TypeOfValue) => void;
  onChange: (event: OnChangeEventLike) => void;
};

export function ShowcaseSelect<T extends string>({
  value,
  options,
  label,
  onChange,
}: ShowcaseSelectProps<T> & { label?: string }) {
  return (
    <div className="showcase showcase-select-wrapper">
      {label && <label className="showcase-select-label">{label}</label>}
      <select
        className="showcase-select"
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
