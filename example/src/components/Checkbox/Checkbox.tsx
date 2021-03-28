import { forwardRef, ComponentPropsWithoutRef, Ref } from 'react';

type Props = ComponentPropsWithoutRef<'input'>;

function Checkbox({ checked, ...props }: Props, ref?: Ref<HTMLInputElement>) {
  return (
    <input
      {...props}
      aria-checked={checked}
      checked={checked}
      type="checkbox"
      ref={ref}
    />
  );
}

export default forwardRef(Checkbox);
