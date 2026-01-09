/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/",

  // Important for static deployment with <Image />
  images: {
    unoptimized: true,
  },
  // Add this:
  trailingSlash: true,
  
  // Webpack config for PDF.js
  webpack: (config) => {
    // Disable canvas for server-side rendering
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
