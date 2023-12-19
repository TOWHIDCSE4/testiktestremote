/** @type {import('tailwindcss').Config} */

const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ["var(--font-lato)", ...fontFamily.sans],
      },
      animation: {
        text: "text 5s ease infinite",
      },
      keyframes: {
        text: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      borderColors: {
        gold: "#DA8D00",
      },
      colors: {
        "light-cyan-blue": "#F5F7FA",
        "dark-cyan-blue": "#2E3C4F",
        "alice-blue": "#EDF0F2",
        "pale-aqua": "#CCD7EC",
        "indigo-blue": "#575F80",
        "dark-blue": "#102136",
        "light-blue": "#E9ECEF",
        gold: "#DA8D00",
      },
      screens: {
        ipadair: "820px",
        ipadair: "768px",
        xl3: "1818px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  darkMode: "class",
  important: true,
}
