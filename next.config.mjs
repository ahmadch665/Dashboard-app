/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary uploads
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org", // Wikipedia / Wikimedia images
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Placeholder fallback
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com", // Flaticon icons
      },
    ],
  },
};

export default nextConfig;
