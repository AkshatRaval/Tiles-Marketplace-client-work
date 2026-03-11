import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
   unoptimized: true, // required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // output: 'export',
  trailingSlash: true,
};

export default nextConfig;