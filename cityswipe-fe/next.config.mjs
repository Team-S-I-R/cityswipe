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
          {
            protocol: 'https',
            hostname: 'giphy.com',
            port: '',
            pathname: '/gifs/**',
          },
          {
            protocol: 'https',
            hostname: 'giphy.com',
            port: '',
            pathname: '/embed/**',
          },
        ],
      }
};

export default nextConfig;
