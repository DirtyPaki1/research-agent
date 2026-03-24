/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  // Add this for Vercel deployment
  output: 'standalone',
}

module.exports = nextConfig
