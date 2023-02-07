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
      /** TODO: This is only for the mobile content. We have to remove this when mobile images are on our server. */
      {
        protocol: 'https',
        hostname: 'fdn2.gsmarena.com'
      },
      /** TODO: This is only for the mobile content. We have to remove this when mobile images are on our server. */
      {
        protocol: 'https',
        hostname: 'fdn.gsmarena.com'
      }
    ]
  }
}

module.exports = nextConfig