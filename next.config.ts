import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Remove API rewrites since we're making direct requests to Nest.js backend
  // The CORS configuration should be handled by your Nest.js backend, not Next.js
};

export default nextConfig;
