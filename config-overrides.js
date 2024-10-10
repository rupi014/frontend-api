const webpack = require('webpack');

// Configuracion de Webpack para compatibilidad con Node.js en el navegador

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "querystring": require.resolve("querystring-es3"),
    "url": require.resolve("url/"),
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "buffer": require.resolve("buffer/"),
    "vm": require.resolve("vm-browserify"),
    "util": require.resolve("util/"),
    "process": require.resolve("process/browser.js"), 
    "fs": false 
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
  ]);

  return config;
};

