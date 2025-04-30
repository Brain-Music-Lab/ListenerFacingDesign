import type { NextConfig } from 'next'

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
              connect-src 'self' ws://localhost:8765 wss://localhost:8765 https://www.googleapis.com https://*.youtube.com;
              worker-src 'self' blob:;
              child-src 'self' blob:;
              form-action 'self';
              base-uri 'self';
              frame-ancestors 'none';
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Permissions-Policy',
            value: 'autoplay=self, fullscreen=self'
          }
        ]
      }
    ];
  }
}

export default nextConfig
