/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  theme: {
    extend: {
      fontFamily: {
        script: ["Style Script", "cursive"],
      },
      colors: {
        "gold-leaf": "#D4AF37",
      },
      backgroundImage: {
        "gold-leaf": "linear-gradient(to right, #D4AF37, #FFF700, #D4AF37)",
      },
    },
  },
  plugins: [],
};
