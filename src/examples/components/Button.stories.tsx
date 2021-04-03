import { ShowcaseToolbar, ShowcaseSelect, useShowcaseSelect } from '../..';

export default {
  Default: () => <button type="button">Default</button>,
  Primary: () => <button type="button">Primary</button>,

  'With Variants': {
    Story: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [variant, selectProps] = useShowcaseSelect(
        ['Primary', 'Secondary', 'Other'],
        'Primary',
      );

      return (
        <>
          <ShowcaseToolbar>
            <ShowcaseSelect label="Variant" {...selectProps} />
          </ShowcaseToolbar>
          <button type="button">{variant}</button>
        </>
      );
    },
  },
};
