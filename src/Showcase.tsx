import clsx from 'clsx';
import Head from 'next/head';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  PropsWithChildren,
  ReactElement,
  ReactPortal,
  MouseEvent,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';

import { styles } from './styles';

/** Props passed to story component. */
type StoryProps = {
  readonly hasZoom: boolean;
};

export type ShowcaseStory = {
  dark?: boolean;
  title?: string | ReactElement;
  description?: string | ReactElement;
  story: FunctionComponent<StoryProps>;
};

type ShowcaseStoryOrComponent = ShowcaseStory | FunctionComponent<StoryProps>;

export type ShowcaseStories = Record<string, ShowcaseStoryOrComponent>;

/**
 * Shape of ES module exporting stories as default export.
 */
type StoriesModule = {
  default: ShowcaseStories;
};

type StoriesModuleDescriptor = {
  group: string;
  name: string;
  source: string;
  loader: () => Promise<StoriesModule>;
};

type StoriesModulesGrouped = {
  group: string;
  modulesInGroup: StoriesModuleDescriptor[];
};

/**
 * Props for Showcase page component.
 */
type ShowcaseProps = {
  storiesModules: Record<string, StoriesModuleDescriptor>;

  /**
   * Timestamp injected every time there is a need to re-render,
   * for example new stories file is found.
   */
  renderId: number;
};

type CurrentStories = {
  source: string;
  stories: ShowcaseStories;
  storiesIds: string[];
};

/**
 * Create nice, human-friendly component name to show in sidebar/nav.
 */
function formatComponentName(n: string): string {
  // Extract component's name from path.
  const m = n.split('_').pop()!;

  // Capitalize first letter.
  return `${m[0]?.toUpperCase()}${m.slice(1)}`;
}

function getGroupOrderFactor(groupName: string): number {
  if (/icons/i.test(groupName)) {
    return 0;
  }

  if (/assets/i.test(groupName)) {
    return 1;
  }

  if (/atoms/i.test(groupName)) {
    return 3;
  }

  if (/molecules/i.test(groupName)) {
    return 4;
  }

  if (/organisms/i.test(groupName)) {
    return 5;
  }

  if (/templates/i.test(groupName)) {
    return 6;
  }

  if (/components/i.test(groupName)) {
    return 2;
  }

  if (/views/i.test(groupName)) {
    return 7;
  }

  if (/pages/i.test(groupName)) {
    return 8;
  }

  return 9999;
}

/**
 * Renders additional things in the Showcase toolbar.
 * User can add its own controls, toggles etc.
 */
export function ShowcaseToolbar({
  children,
}: PropsWithChildren<{}>): ReactPortal | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    children,
    document.getElementById(`showcase-toolbar-slot`)!,
  );
}

function useStateWithNull<TypeOfValue>(initialState: TypeOfValue | null) {
  const [value, setValue] = useState<TypeOfValue | null>(initialState);

  const setNull = useCallback(() => {
    setValue(null);
  }, []);

  return [value, setValue, setNull] as const;
}

function useBoolState(initialState: boolean) {
  const [value, setValue] = useState<boolean>(initialState);

  const toggle = useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  return [value, setValue, toggle] as const;
}

function Showcase({ renderId, storiesModules }: ShowcaseProps) {
  const [
    currentModule,
    setCurrentModule,
    unsetCurrentModule,
  ] = useStateWithNull<CurrentStories>(null);
  const [
    currentStoryId,
    setCurrentStoryId,
    unsetCurrentStoryId,
  ] = useStateWithNull<string>(null);

  const [hasBackground, , toggleHasBackground] = useBoolState(true);
  const [hasZoom, , toggleHasZoom] = useBoolState(false);

  const loadModule = useCallback(
    async (moduleName: string) => {
      const storiesModule = storiesModules[moduleName];

      if (!storiesModule) {
        return;
      }

      // Load stories ES module.
      const { loader, source } = storiesModule;
      const { default: defaultExport } = await loader();
      const storiesIds = Object.keys(defaultExport);

      // Havin 'default' story is just some convention,
      // but it's not guaranteed to have it, since user decides
      // how to name eacch single one.
      // If we don't have the default one, we just grab the first one
      // from the object.
      const defaultVariant: string | undefined =
        'default' in defaultExport ? 'default' : storiesIds[0];

      // Set currently open story variant.
      // It's 'default' or the first one (in terms of alphabetical order).
      setCurrentStoryId(defaultVariant ?? 'default');

      // Finally render stories of selected module.
      setCurrentModule({
        storiesIds,
        source,
        stories: defaultExport,
      });
    },
    [setCurrentModule, setCurrentStoryId, storiesModules],
  );

  // Add refs for useEffect.
  const currentModuleRef = useRef(currentModule);
  const loadModuleRef = useRef(loadModule);

  currentModuleRef.current = currentModule;
  loadModuleRef.current = loadModule;

  useEffect(() => {
    // Every time we will be forced to render by some additional/updated stories
    // we manually re-load current module.
    // It's crucial that hook dependecy array contains only 'renderId'.
    if (currentModuleRef.current && renderId) {
      loadModuleRef.current(currentModuleRef.current.source);
    }
  }, [renderId]);

  const rawStoryStruct: ShowcaseStoryOrComponent | null =
    currentModule && currentStoryId && currentStoryId in currentModule.stories
      ? currentModule.stories[currentStoryId] ?? null
      : null;

  const storyStruct: ShowcaseStory | null =
    rawStoryStruct === null
      ? null
      : typeof rawStoryStruct === 'function'
      ? { story: rawStoryStruct }
      : rawStoryStruct;

  const StoryComponent: FunctionComponent<StoryProps> | null =
    storyStruct === null ? null : storyStruct.story;

  const handleModuleClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const moduleSourcePath = evt.currentTarget.name;

      if (!moduleSourcePath) {
        throw new Error('Missing module source on event target');
      }

      // We don't have any module opened or we have some other one opened.
      // For both cases we want to load the module. Notice that once module is
      // requested via network it will be loaded from cache every second and next time
      // unless it has been updated.
      if (currentModule === null || currentModule.source !== moduleSourcePath) {
        loadModuleRef.current(moduleSourcePath);
        return;
      }

      // This is just a toggle, so hide the module.
      unsetCurrentModule();
      unsetCurrentStoryId();
    },
    [currentModule, unsetCurrentModule, unsetCurrentStoryId],
  );

  const handleStoryClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const storyId = evt.currentTarget.name;

      if (!storyId) {
        throw new Error('Missing story id on event target');
      }

      setCurrentStoryId(storyId);
    },
    [setCurrentStoryId],
  );

  const groupedModules: StoriesModulesGrouped[] = useMemo(() => {
    const grouped: Record<string, StoriesModuleDescriptor[]> = {};

    Object.entries(storiesModules).forEach(([, storiesModule]) => {
      if (!(storiesModule.group in grouped)) {
        grouped[storiesModule.group] = [];
      }

      grouped[storiesModule.group]?.push(storiesModule);
    });

    return Object.entries(grouped)
      .map(([group, modulesInGroup]) => ({ group, modulesInGroup }))
      .sort((a, b) => {
        const groupOrderFactorA = getGroupOrderFactor(a.group);
        const groupOrderFactorB = getGroupOrderFactor(b.group);

        return groupOrderFactorB >= groupOrderFactorA ? -1 : 1;
      });
  }, [storiesModules]);

  return (
    <div
      id="__next-showcase-root"
      data-has-background={String(hasBackground)}
      data-has-zoom={String(hasZoom)}
      data-is-dark={String(storyStruct ? storyStruct.dark : false)}
    >
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Overpass:wght@300;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Next Showcase - UI components & assets preview</title>
      </Head>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div id="showcase-wrapper">
        {/*
          Start of the sidebar with list of all components.
        */}
        <div className="showcase" id="showcase-nav">
          {groupedModules.map(({ group, modulesInGroup }) => (
            <div className="showcase-group" key={group}>
              <div className="showcase showcase-group-name">
                {group.toUpperCase()}
              </div>
              {modulesInGroup.map((moduleFromGroup) => (
                <div className="showcase-navitem" key={moduleFromGroup.source}>
                  <button
                    type="button"
                    className={clsx(`showcase-item-button`, {
                      'showcase-item-button__current':
                        moduleFromGroup.source === currentModule?.source,
                    })}
                    name={moduleFromGroup.source}
                    onClick={handleModuleClick}
                  >
                    {formatComponentName(moduleFromGroup.name)}
                  </button>
                  {/*
                  If this component is currently active, show list of its stories.
                */}
                  {currentModule?.source === moduleFromGroup.source && (
                    <div id="showcase-variants-nav">
                      {currentModule.storiesIds.map((storyId) => (
                        <button
                          className={clsx('showcase-variant-button', {
                            'showcase-variant-button__current':
                              storyId === currentStoryId,
                          })}
                          key={storyId}
                          name={storyId}
                          type="button"
                          onClick={handleStoryClick}
                        >
                          {storyId}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/*
          Right panel where toolbar and preview are rendered.
        */}
        <div id="showcase-rendering">
          <div className="showcase" id="showcase-toolbar">
            {/*
              Toolbar.
            */}
            <div className="showcase-toolbar-box" id="showcase-options-nav">
              <label className="showcase-checkbox-label">
                <input
                  type="checkbox"
                  className="showcase-input"
                  checked={hasBackground}
                  onChange={toggleHasBackground}
                />
                <span className="showcase-checkbox-span"> Squares Bg</span>
              </label>
              <label className="showcase-checkbox-label">
                <input
                  checked={hasZoom}
                  className="showcase-input"
                  onChange={toggleHasZoom}
                  type="checkbox"
                />
                <span className="showcase-checkbox-span">x2</span>
              </label>
              {currentModule && (
                <button
                  className="showcase-button"
                  onClick={unsetCurrentModule}
                  type="button"
                >
                  Close
                </button>
              )}
            </div>
            {/*
              Here goes all custom controls added by user via ShowcaseToolbar portal.
            */}
            <div className="showcase-toolbar-box" id="showcase-toolbar-slot" />
          </div>
          {/*
            Optional title and description for story.
          */}
          {storyStruct && (
            <div className="showcase" id="showcase-summary">
              {storyStruct.title && (
                <div id="showcase-summary-title">{storyStruct.title}</div>
              )}
              {storyStruct.description && (
                <div id="showcase-summary-description">
                  {storyStruct.description}
                </div>
              )}
            </div>
          )}
          {/*
            This is where our story is rendered.
          */}
          <div className="showcase-wrapping-outer-box">
            {/*
              Direct wrapper of story (provides zoom mostly).
            */}
            <div id="showcase-component-box">
              {StoryComponent ? (
                <StoryComponent hasZoom={hasZoom} />
              ) : currentModule ? (
                <div className="showcase">
                  No such variant: {String(currentStoryId)}
                </div>
              ) : (
                <div className="showcase" id="showcase-nothing-selected">
                  Nothing is selected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Showcase);
