module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Provide empty fallbacks for Node.js built-ins used by wasmoon's
      // Emscripten output (these code paths only run in Node, not in the browser)
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        module: false,
        fs: false,
        path: false,
        url: false,
        crypto: false,
        stream: false,
        child_process: false,
      };
      return webpackConfig;
    },
  },
};
