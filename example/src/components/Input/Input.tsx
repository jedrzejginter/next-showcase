import { forwardRef, ComponentPropsWithoutRef, Ref } from 'react';

type Props = ComponentPropsWithoutRef<'input'>;

function Input(props: Props, ref?: Ref<HTMLInputElement>) {
  return <input {...props} ref={ref} />;
}

export default forwardRef(Input);
