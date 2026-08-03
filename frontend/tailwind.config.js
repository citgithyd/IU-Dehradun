/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ifhe: {
          950: "#1a0f3d",
          900: "#241454",
          800: "#2f1a6e",
          700: "#3d2288",
          600: "#4c2ba8",
          500: "#5b34c8",
          400: "#8b6ae0",
          gold: "#d4a94a",
          cream: "#faf8f4",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        widget: "0 20px 60px -15px rgba(36, 20, 84, 0.45)",
        bubble: "0 2px 10px rgba(36, 20, 84, 0.08)",
      },
      keyframes: {
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "bounce-dot": "bounce-dot 1.2s infinite ease-in-out",
        "slide-up": "slide-up 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
