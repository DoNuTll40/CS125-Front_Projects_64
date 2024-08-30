/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slidein: {
          from: {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        slidein: "slidein 0.5s ease var(--slidein-delay, 0) forwards",
      },
      fontFamily: {
        sans: ["Noto Sans Thai", "sans-serif"],
        itim: ["Itim", "sans-serif"],
        prompt: ["Prompt", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
      },
    },
    screens: {
      mobile: "426px",
      sm: "475px",
      md: "685px",
      lg: "769px",
      xl: "1024px",
      '2xl': "1226px",
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
};
