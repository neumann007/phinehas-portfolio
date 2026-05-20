import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.100.147'],
  images: {
    domains: []
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/',
        permanent: false,
      },
      {
        source: '/blog/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  }
}

export default nextConfig
