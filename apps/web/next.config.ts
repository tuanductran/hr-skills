import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['127.0.0.1'],
	compress: process.env.NODE_ENV === 'production',
};

export default nextConfig;
