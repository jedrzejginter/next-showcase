module.exports = {
  // We don't benefit from exposing that our app is running Next.js
  // so why not to hide this information.
  poweredByHeader: false,

  // React's Strict Mode is a development mode only feature for highlighting
  // potential problems in an application. It helps to identify unsafe
  // lifecycles, legacy API usage, and a number of other features.
  reactStrictMode: true,

  // Custom webpack config.
  webpack: (config) => config,
};
