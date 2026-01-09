/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/",

  // Important for static deployment with <Image />
  images: {
    unoptimized: true,
  },
  // Add this:
  trailingSlash: true,
};

export default nextConfig;
