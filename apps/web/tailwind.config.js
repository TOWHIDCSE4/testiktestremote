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
        "light-blue": "#E9ECEF",
      },
      fontFamily: {
        BebasNeueBold: ["BebasNeueBold", "sans-serif"],
        BebasNeueBook: ["BebasNeueBook", "sans-serif"],
        BebasNeueLight: ["BebasNeueLight", "sans-serif"],
        BebasNeueRegular: ["BebasNeueRegular", "sans-serif"],
        LatoBlack: ["LatoBlack", "sans-serif"],
        LatoBlackItalic: ["LatoBlackItalic", "sans-serif"],
        LatoBold: ["LatoBold", "sans-serif"],
        LatoBoldItalic: ["LatoBoldItalic", "sans-serif"],
        LatoItalic: ["LatoItalic", "sans-serif"],
        LatoLight: ["LatoLight", "sans-serif"],
        LatoLightItalic: ["LatoLightItalic", "sans-serif"],
        LatoRegular: ["LatoRegular", "sans-serif"],
        LatoThin: ["LatoThin", "sans-serif"],
        LatoThinItalic: ["LatoThinItalic", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
