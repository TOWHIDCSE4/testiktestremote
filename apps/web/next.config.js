const { existsSync } = require("fs")
require("dotenv").config({
  path: existsSync("../../.env") ? "../../.env" : "../../../.env",
})

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/files/:path*",
        destination: `${process.env.MEDIA_URL}/api/files/:path*`,
      },
      {
        source: "/files/:path*",
        destination: `${process.env.MEDIA_URL}/files/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ]
  },
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    CLARITY_KEY: process.env.CLARITY_KEY,
    MEDIA_KEY: process.env.MEDIA_KEY,
  },
}
