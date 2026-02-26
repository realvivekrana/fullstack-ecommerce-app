/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
    ],
    // Fallback to domains for older Next.js versions
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
      'placehold.co',
      'dummyimage.com',
      'fakestoreapi.com',
      'cdn.dummyjson.com',
    ],
  },
}

module.exports = nextConfig
