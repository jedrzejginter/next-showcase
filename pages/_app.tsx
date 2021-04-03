import NextApp from 'next/app';

import { withShowcase } from '../src';

function App() {
  return (
    <div>
      This simulates behaviour of not wrapping custom app with{' '}
      <code>withShowcase</code>.
      <br />
      You <b>should not</b> see this on <code>/_next-showcase</code> URL.
    </div>
  );
}

App.getInitialProps = NextApp.getInitialProps;

export default withShowcase(App, {
  SidebarHeader: () => <b>@ginterdev/next-showcase</b>,
});
