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
      }
    ]
  }
}

module.exports = nextConfig