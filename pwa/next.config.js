const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  crossOrigin: 'anonymous',
  output: 'standalone',
    webpack: (config) => {
      // camelCase style names from css modules
      config.module.rules
          .find(({oneOf}) => !!oneOf).oneOf
          .filter(({use}) => JSON.stringify(use)?.includes('css-loader'))
          .reduce((acc, {use}) => acc.concat(use), [])
          .forEach(({options}) => {
              if (options.modules) {
                  options.modules.exportLocalsConvention = 'camelCase';
              }
          });
      // https://stackoverflow.com/questions/76676456/next-js-v13-in-docker-does-not-respect-path-alias-but-works-locally
      config.resolve.alias['Utils'] = path.join(__dirname, 'utils');
      config.resolve.alias['Components'] = path.join(__dirname, 'components');

      return config;
  },
};

module.exports = nextConfig
