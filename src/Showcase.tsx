import React, { FunctionComponent, memo, useCallback, useState } from "react";

type Stories = Record<string, FunctionComponent<{}>>;

type StoriesModule = {
  default: Stories;
};

type Props = {
  storiesLoaders: Record<string, () => Promise<StoriesModule>>;
};

function Showcase({ storiesLoaders }: Props) {
  const [mod, setMod] = useState<{ stories: Stories; name: string } | null>(null);
  const [variant, setVariant] = useState<string | null>(null);

  const load = useCallback(
    async (name: string) => {
      const storiesModule = await storiesLoaders[name]();
      const defaultExport = storiesModule.default;

      const defaultVariant = "default" in defaultExport ? "default" : Object.keys(defaultExport)[0];

      setVariant(defaultVariant);
      setMod({ stories: defaultExport, name });
    },
    [storiesLoaders],
  );

  const Comp = mod && variant && variant in mod.stories ? mod.stories[variant] : null;

  return (
    <div className="fixed inset-0 overflow-auto flex items-start">
      <ul className="w-64">
        {Object.keys(storiesLoaders).map((name: any) => (
          <li className="cursor-pointer hover:underline" key={name} onClick={() => load(name)}>
            {name === mod?.name ? <mark>{name}</mark> : name}
          </li>
        ))}
      </ul>
      {mod && (
        <div className="overflow-auto">
          <button onClick={() => setMod(null)} type="button">
            [x]
          </button>
          <ul>
            {Object.keys(mod.stories)
              .sort()
              .map((v) => {
                return (
                  <li className="cursor-pointer" key={v} onClick={() => setVariant(v)}>
                    {v === variant ? <mark>{v}</mark> : v}
                  </li>
                );
              })}
          </ul>
          <hr />
          {Comp ? <Comp /> : <p>No such variant: {variant}</p>}
        </div>
      )}
    </div>
  );
}

export default memo(Showcase);
