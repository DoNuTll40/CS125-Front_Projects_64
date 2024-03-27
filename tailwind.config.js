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
    screens: {
      'mobile': '426px',
      'sm': '475px',
      'md': '685px',
      'lg': '769px',
    },
  },
  plugins: [require("daisyui")],
};
