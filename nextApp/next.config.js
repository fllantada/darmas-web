const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

module.exports = {
  reactStrictMode: false, // Only uncomment if you are using a library that is not compatible with React Strict Mode ( e.g. react-big-calendar)
  webpack: config => {
    config.plugins.push(new CaseSensitivePathsPlugin());
    return config;
  },
  output: "standalone",
};
