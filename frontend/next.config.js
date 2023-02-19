// Parsing error: Cannot find module 'next/babel' is not fixable yet without breaking es-lint: https://github.com/world-wide-weights/wwweights/issues/190
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