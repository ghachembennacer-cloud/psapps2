/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.playstation.com' },
      { protocol: 'https', hostname: '**.sonyentertainmentnetwork.com' },
    ],
  },
};
export default nextConfig;