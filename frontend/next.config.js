/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: '**'
      }
    ]
  }
}

module.exports = nextConfig