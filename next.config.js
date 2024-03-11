/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: process.env.BASE_PATH || "",
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = nextConfig;
