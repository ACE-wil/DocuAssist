/** @type {import('next').NextConfig} */

const path = require("path");
const withLess = require("next-with-less");

const nextConfig = withLess({
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./"),
    };
    return config;
  },
});

module.exports = nextConfig;
