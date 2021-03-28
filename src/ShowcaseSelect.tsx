import React, { useCallback, useMemo, useState } from 'react';

/**
 * Implements the simplest shape of ChangeEvent we require to update prop variant.
 * The only thing we need is value.
 */
type OnChangeEventLike = {
  target: {
    value: string
  }
}

export type ShowcaseSelectProps<TypeOfValue extends string> = {
  onChange: (event: OnChangeEventLike) => void;
  options: TypeOfValue[];
  setValue: (newValue: TypeOfValue) => void;
  value: TypeOfValue;
};

export default function ShowcaseSelect<T extends string>({
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

export function useShowcaseSelect<TypeOfValue extends string>(
  options: TypeOfValue[],
  defaultValue: TypeOfValue,
): [TypeOfValue, ShowcaseSelectProps<TypeOfValue>] {
  const [value, setValue] = useState<TypeOfValue>(defaultValue);

  const onChange = useCallback(
    (event: OnChangeEventLike) => {
      setValue(event.target.value as TypeOfValue);
    },
    [],
  );

  const propsForSelect = useMemo(
    () => ({
      value,
      options,
      onChange,
      setValue,
    }),
    [value, options],
  );

  return [value, propsForSelect];
}

