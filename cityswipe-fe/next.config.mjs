/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.pexels.com',
            port: '',
            pathname: '/photos/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
