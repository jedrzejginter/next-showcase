import { useCallback, useMemo, useState } from 'react';

import { OnChangeEventLike, ShowcaseSelectProps } from './ShowcaseSelect';

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

  const utils = useMemo(
    () => ({
      value,
      options,
      onChange,
      setValue,
    }),
    [value, options],
  );

  return [value, utils];
}
