import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/:path*'  // In production, route to Vercel functions
          : 'http://localhost:8000/api/:path*',  // In development, route to local backend
      },
    ];
  },
  trailingSlash: false,
};

export default nextConfig;
