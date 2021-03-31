import NextApp from 'next/app';

import { withShowcase } from '../src';

function App() {
  return (
    <div>
      This simulates behaviour of not wrapping custom app with `withShowcase`.
      <br />
      Your <b>should not</b> see this.
    </div>
  );
}

App.getInitialProps = NextApp.getInitialProps;

export default withShowcase(App);
