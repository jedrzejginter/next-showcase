import clsx from 'clsx';
import html2canvas from 'html2canvas';
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
} from 'react';
import { createPortal } from 'react-dom';

import { styles } from './styles';

/** Props passed to story component. */
type StoryProps = {
  readonly hasZoom: boolean;
};

export type ShowcaseStory = {
  dark?: boolean;
  title?: string;
  description?: string | ReactElement;
  scene: FunctionComponent<StoryProps>;
};

type ShowcaseStoryOrComponent = ShowcaseStory | FunctionComponent<StoryProps>;

export type ShowcaseStories = Record<string, ShowcaseStoryOrComponent>;

/**
 * Shape of ES module exporting stories as default export.
 */
type StoriesModule = {
  default: ShowcaseStories;
};

/**
 * Props for Showcase page component.
 */
type ShowcaseProps = {
  /**
   * Map of factory functions returning dynamic imports for each stories module found
   * in the repository tree.
   */
  moduleLoaders: Record<string, () => Promise<StoriesModule>>;

  /**
   * Timestamp injected every time there is a need to re-render,
   * for example new stories file is found.
   */
  renderId: number;
};

type CurrentStories = {
  name: string;
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

function Showcase({ renderId, moduleLoaders }: ShowcaseProps) {
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
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const [hasShadowBox, , toggleHasShadowBox] = useBoolState(false);
  const [hasBackground, , toggleHasBackground] = useBoolState(true);
  const [hasZoomX2, , toggleHasZoomX2] = useBoolState(false);

  const loadModule = useCallback(
    async (moduleName: string) => {
      // Load stories ES module.
      const storiesModule = await moduleLoaders[moduleName]?.();

      if (!storiesModule) {
        return;
      }

      const { default: defaultExport } = storiesModule;
      const storiesIds = Object.keys(defaultExport).sort();

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
        name: moduleName,
        stories: defaultExport,
      });
    },
    [setCurrentModule, setCurrentStoryId, moduleLoaders],
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
      loadModuleRef.current(currentModuleRef.current.name);
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
      ? { scene: rawStoryStruct }
      : rawStoryStruct;

  const StoryComponent: FunctionComponent<StoryProps> | null =
    storyStruct === null ? null : storyStruct.scene;

  const downloadComponent = useCallback(async () => {
    if (!currentModule) {
      return;
    }

    setIsDownloading(true);

    try {
      const componentDomElement = document.getElementById(
        'showcase-shadow-box',
      );

      if (!componentDomElement) {
        return;
      }

      const { toDataURL } = await html2canvas(componentDomElement);

      const uri: string = toDataURL();
      const zoomPrefix = hasZoomX2 ? '@x2' : '';
      const { name: displayName } = currentModule;

      const filename = `${displayName}__${currentStoryId}${zoomPrefix}.png`;

      const link = document.createElement('a');

      link.download = filename;
      link.href = uri;

      // Download file.
      document.body.appendChild(link);
      link.click();

      // Clean up the DOM.
      link.remove();
    } finally {
      setIsDownloading(false);
    }
  }, [currentModule, currentStoryId, hasZoomX2]);

  const handleModuleClick = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      const moduleName = evt.currentTarget.name;

      if (!moduleName) {
        throw new Error('Missing module name on event target');
      }

      // We don't have any module opened or we have some other one opened.
      // For both cases we want to load the module. Notice that once module is
      // requested via network it will be loaded from cache every second and next time
      // unless it has been updated.
      if (currentModule === null || currentModule.name !== moduleName) {
        loadModuleRef.current(moduleName);
        return;
      }

      // This is just a toggle, so hide the module.
      unsetCurrentStoryId();
    },
    [currentModule, unsetCurrentStoryId],
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

  return (
    <div
      id="__next-showcase-root"
      data-has-background={String(hasBackground)}
      data-has-zoom={String(hasZoomX2)}
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
          {Object.values(moduleLoaders).map((moduleLoader) => (
            <div className="showcase-navitem" key={moduleLoader.name}>
              <button
                type="button"
                className={clsx(`showcase-item-button`, {
                  'showcase-item-button__current':
                    moduleLoader.name === currentModule?.name,
                })}
                name={moduleLoader.name}
                onClick={handleModuleClick}
              >
                {formatComponentName(moduleLoader.name)}
              </button>
              {/*
                If this component is currently active, show list of stories for it whenever there
                are at least two of them..
              */}
              {currentModule?.name === moduleLoader.name &&
                currentModule?.storiesIds.length > 1 && (
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
                  checked={hasShadowBox}
                  disabled={!currentModule}
                  onChange={toggleHasShadowBox}
                  type="checkbox"
                />
                <span className="showcase-checkbox-span">Shadow Box</span>
              </label>
              <label className="showcase-checkbox-label">
                <input
                  type="checkbox"
                  checked={hasBackground}
                  onChange={toggleHasBackground}
                />
                <span className="showcase-checkbox-span"> Background</span>
              </label>
              <label className="showcase-checkbox-label">
                <input
                  checked={hasZoomX2}
                  onChange={toggleHasZoomX2}
                  type="checkbox"
                />
                <span className="showcase-checkbox-span">x2</span>
              </label>
              {currentModule && (
                <>
                  <button
                    className="showcase-button"
                    onClick={unsetCurrentModule}
                    type="button"
                  >
                    Close
                  </button>
                  <button
                    className="showcase-button"
                    disabled={isDownloading}
                    onClick={downloadComponent}
                    type="button"
                  >
                    &#8681; Download
                  </button>
                </>
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
              Direct wrapper of story which adds shadow when this option is active.
            */}
            <div
              className={clsx({ 'showcase-bounding-shadow': hasShadowBox })}
              id="showcase-shadow-box"
            >
              {StoryComponent ? (
                <StoryComponent hasZoom={hasZoomX2} />
              ) : (
                currentModule && (
                  <div className="showcase">
                    No such variant: {currentStoryId}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Showcase);
