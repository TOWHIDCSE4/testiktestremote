const { resolve } = require("node:path")

const project = resolve(process.cwd(), "tsconfig.json")

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],

  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "eslint-config-custom/",
    "*.config.js",
  ],
  // add rules configurations here
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "import/no-default-export": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-types": "off",
    "no-undef": "error",
  },
}
