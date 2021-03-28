import { memo, forwardRef, ComponentPropsWithoutRef, Ref } from 'react';

type Props = ComponentPropsWithoutRef<'svg'>;

const nodes: any[] = Array(9);
const rotateStep: number = 360 / nodes.length;

function Spinner(props: Props, ref?: Ref<SVGSVGElement>) {
  return (
    <svg {...props} ref={ref} viewBox="10 10 80 80">
      {nodes.map((_, index) => (
        <rect
          height="20"
          key={index}
          rx="5"
          ry="5"
          transform={`rotate(${index * rotateStep} 50 50) translate(0 -30)`}
          width="8"
          x="46"
          y="40"
        >
          <animate
            attributeName="opacity"
            begin={`-${(nodes.length - index) / nodes.length}s`}
            dur="0.8s"
            from="1"
            repeatCount="indefinite"
            to="0"
          />
        </rect>
      ))}
    </svg>
  );
}

export default memo(forwardRef(Spinner));
