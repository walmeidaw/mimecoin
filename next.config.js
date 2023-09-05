/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // matching all API routes
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Content-Type", value : "*/*; charset=utf-8" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "*" },
          ]
        }
      ]
    },
    experimental: {
      serverActions: true,
    },
}

module.exports = nextConfig
