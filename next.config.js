/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  assetPrefix: "/",

  // Important for static deployment with <Image />
  images: {
    unoptimized: true,
  },
  // Add this:
  trailingSlash: true,
};

export default nextConfig;
