/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f5f4f0",
          100: "#e8e6df",
          200: "#d0cdc2",
          300: "#b0ac9f",
          400: "#8c887a",
          500: "#6e6a5c",
          600: "#565248",
          700: "#3f3d35",
          800: "#2a2924",
          900: "#1a1916",
          950: "#0d0c0a",
        },
        sage: {
          300: "#a8bfaa",
          400: "#8aaa8d",
          500: "#6d9471",
          600: "#567559",
        },
        clay: {
          300: "#d4a59a",
          400: "#c4887a",
          500: "#b06b5c",
        },
        sky: {
          300: "#a0b8cc",
          400: "#7fa0bc",
          500: "#5e88aa",
        }
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.3s ease forwards",
        "pulse-dot": "pulseDot 1.2s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(10px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        pulseDot: { "0%,80%,100%": { transform: "scale(0.6)", opacity: 0.4 }, "40%": { transform: "scale(1)", opacity: 1 } },
      }
    },
  },
  plugins: [],
};
