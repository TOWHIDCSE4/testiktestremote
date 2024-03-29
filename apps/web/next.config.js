/** @type {import('next').NextConfig} */

const { existsSync } = require("fs")
const path = require("path")
require("dotenv").config({
  path: existsSync("../../.env") ? "../../.env" : "../../../.env",
})

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    ]
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { webpack, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.CONFIG_BUILD_ID": JSON.stringify(buildId),
      })
    )
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })
    return config
  },
  env: {
    MEDIA_KEY: process.env.MEDIA_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SENTRY_WEB_DSN: process.env.SENTRY_WEB_DSN,
    NEXT_PUBLIC_ENV_NAME: process.env.ENV_NAME,
  },
}

// Injected content via Sentry wizard below

// const { withSentryConfig } = require("@sentry/nextjs")

// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://github.com/getsentry/sentry-webpack-plugin#options

//     // Suppresses source map uploading logs during build
//     silent: true,
//     org: "elite-l0",
//     project: "apms-web-dev",
//   },
//   {
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,

//     // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     transpileClientSDK: true,

//     // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
//     tunnelRoute: "/monitoring",

//     // Hides source maps from generated client bundles
//     hideSourceMaps: true,

//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,
//   }
// )
