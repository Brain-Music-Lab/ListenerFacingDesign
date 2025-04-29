import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com;
              frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https: data:;
              media-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
              connect-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.googleapis.com;
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'Permissions-Policy',
            value: 'autoplay=self'
          }
        ]
      }
    ];
  },
  reactStrictMode: true,
}

export default nextConfig;
