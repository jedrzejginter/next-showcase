import hoistNonReactStatics from 'hoist-non-react-statics';
import NextApp, {
  AppProps as NextAppProps,
  AppContext,
  AppInitialProps,
} from 'next/app';
import React, { ComponentType, PropsWithChildren } from 'react';

type WithShowcaseOptions = {
  useRouter?: () => { pathname: string };
  Wrapper?: ComponentType<{ isShowcasePage?: boolean }>;
  skipInitialProps?: boolean;
};

type WithShowcaseAppShape<
  AppProps extends NextAppProps
> = ComponentType<AppProps> & {
  getInitialProps?: (appContext: AppContext) => Promise<AppInitialProps>;
};

/**
 * Default Wrapper (see 'options' for 'withShowcase').
 */
function WrapperPlaceholder({ children }: PropsWithChildren<{}>) {
  return <>{children}</>;
}

/** Check if the `pathname` is showcase's pathname. */
export function isShowcaseComponent(something: unknown): boolean {
  return Object.prototype.hasOwnProperty.call(something, 'IS_SHOWCASE_PAGE');
}

/**
 * Wrap custom App with a simple hoc that won't render specifics
 * for user app layout, for example navigation, footer when visiting
 * '/_next-showcase'. Ideally the only thing that renders is
 * Showcase component.
 */
export default function withShowcase<AppProps extends NextAppProps>(
  App: WithShowcaseAppShape<AppProps>,
  options: WithShowcaseOptions = {},
) {
  const Wrapper = options.Wrapper ?? WrapperPlaceholder;
  const skipInitialProps = options.skipInitialProps ?? false;

  function NextAppWithShowcase(props: AppProps) {
    const { Component, pageProps } = props;

    // Don't render anything specific for user's project.
    // User can still customize rendering via Wrapper, for example
    // add some global contexts when needed.
    // This can be useful for notification system, when global context is
    // used and UI components are coupled to it.
    if (Object.prototype.hasOwnProperty.call(Component, 'IS_SHOWCASE_PAGE')) {
      return (
        <Wrapper isShowcasePage>
          <Component {...pageProps} />
        </Wrapper>
      );
    }

    // Render everything as there was no Showcase used.
    return (
      <Wrapper isShowcasePage={false}>
        <App {...props} />
      </Wrapper>
    );
  }

  const NextAppWithShowcaseHoistedStatics = hoistNonReactStatics(
    NextAppWithShowcase,
    App,
  );

  if (!skipInitialProps) {
    NextAppWithShowcaseHoistedStatics.getInitialProps = (
      appContext: AppContext,
    ) => {
      // Not sure if we should do this, but this place skips whole logic
      // of users custom App. Use case for this might be skipping authentication
      // to access showcase page.
      // I don't expect to break something here. If it does break, user can always
      // set `skipInitialProps = false`.
      if (isShowcaseComponent(appContext.Component)) {
        return NextApp.getInitialProps(appContext);
      }

      // Just do everything as is for non-showcase urls.
      return App.getInitialProps
        ? App.getInitialProps(appContext)
        : // Fallback to basic 'getInitialProps'.
          NextApp.getInitialProps(appContext);
    };
  }

  return NextAppWithShowcaseHoistedStatics;
}
