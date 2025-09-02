/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        one: "#eefbfd",
        two: "#d3f3fa",
        three: "#ace5f5",
        four: "#73d2ed",
        five: "#23a9d4",
        six: "#1797c3",
        seven: "#1678a4",
        eight: "#196285",
        nine: "#1d516d",
        ten: "#1c445d",
        white: "#FFFFF0",
        black: "#1C1C1C",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
