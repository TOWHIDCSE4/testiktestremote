/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "light-cyan-blue": "#F5F7FA",
        "dark-cyan-blue": "#2E3C4F",
        "alice-blue": "#EDF0F2",
        "pale-aqua": "#CCD7EC",
        "indigo-blue": "#575F80",
        "dark-blue": "#102136",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
