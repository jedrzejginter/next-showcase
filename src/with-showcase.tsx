import hoistNonReactStatics from 'hoist-non-react-statics';
import NextApp, { AppProps, AppContext, AppInitialProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { ComponentType, PropsWithChildren } from 'react';

type WithShowcaseOptions = {
  useRouter?: () => { pathname: string };
  Wrapper?: ComponentType<{ isShowcasePage?: boolean }>;
  skipInitialProps?: boolean;
};

type WithShowcaseAppShape = ComponentType<AppProps> & {
  getInitialProps?: (appContext: AppContext) => Promise<AppInitialProps>;
};

/**
 * Default Wrapper (see 'options' for 'withShowcase').
 */
function WrapperPlaceholder({ children }: PropsWithChildren<{}>) {
  return <>{children}</>;
}

/** Check if the `pathname` is showcase's pathname. */
export function isShowcasePathname(pathname: string): boolean {
  return /__showcase/.test(pathname);
}

/**
 * Wrap custom App with a simple hoc that won't render specifics
 * for user app layout, for example navigation, footer when visiting
 * '/__showcase'. Ideally the only thing that renders is Showcase component.
 */
export default function withShowcase(
  App: WithShowcaseAppShape,
  options: WithShowcaseOptions = {},
) {
  const Wrapper = options.Wrapper ?? WrapperPlaceholder;
  const skipInitialProps = options.skipInitialProps ?? false;

  function NextAppWithShowcase({ Component, pageProps, ...props }: AppProps) {
    const { pathname } = useRouter();

    // Don't render anything specific for user's project.
    // User can still customize rendering via Wrapper, for example
    // add some global contexts when needed.
    // This can be useful for notification system, when global context is
    // used and UI components are coupled to it.
    if (isShowcasePathname(pathname)) {
      return (
        <Wrapper isShowcasePage>
          <Component {...pageProps} />
        </Wrapper>
      );
    }

    // Render everything as there was no Showcase used.
    return (
      <Wrapper isShowcasePage={false}>
        <App Component={Component} pageProps={pageProps} {...props} />
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
      if (isShowcasePathname(appContext.router.pathname)) {
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
