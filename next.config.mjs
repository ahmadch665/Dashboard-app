/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: [
      "upload.wikimedia.org",
      "via.placeholder.com",
    ],
     remotePatterns: [
      {
        protocol: "blob",
        hostname: "**", // blob URLs ko allow karega
      },
    ],
  },
};

export default nextConfig;
