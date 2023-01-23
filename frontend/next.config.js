/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
	output: "standalone",
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'fdn2.gsmarena.com'
      }
    ]
  }
}

module.exports = nextConfig