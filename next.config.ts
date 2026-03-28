import type { NextConfig } from 'next';

console.debug('ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS : 'localhost:9500';
console.debug('Allowed Origins:', allowedOrigins);

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.111'],
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'prisma'],
  experimental: {
    serverActions: {
      allowedOrigins: allowedOrigins ? allowedOrigins.split(',') : ['*'],
    },
  },
  async headers() {
    return [
      {
        source: '/track.js',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      {
        source: '/api/analytics/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};

export default nextConfig;
