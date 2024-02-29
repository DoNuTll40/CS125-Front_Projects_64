/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Thai", "sans-serif"],
        itim: ["Itim", "sans-serif"],
        prompt: ["Prompt", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
