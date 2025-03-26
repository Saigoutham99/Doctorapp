const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser.js"),
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    path: require.resolve("path-browserify"),
    util: require.resolve("util"),
    zlib: require.resolve("browserify-zlib"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    querystring: require.resolve("querystring-es3"),
    url: require.resolve("url"),
    fs: false,
    net: false,
    tls: false,
    child_process: false,
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    })
  );

  return config;
};
