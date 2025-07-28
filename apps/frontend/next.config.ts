import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api_be/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/:path*'  // In production, route to Vercel functions
          : 'http://localhost:8000/:path*',  // In development, route to local backend
      },
    ];
  },
  // Vercel deployment settings
  trailingSlash: false,
  output: 'standalone',
};

export default nextConfig;
