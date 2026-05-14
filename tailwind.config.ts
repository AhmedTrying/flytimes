import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6A1A",
          "orange-dark": "#D9500A",
          "orange-soft": "#FFE9D3",
          "orange-deep": "#C85208",
          ink: "#1e1b16",
          cream: "#fff9ef",
          muted: "#5a5348",
          "muted-soft": "#8a8070",
        },
      },
      fontFamily: {
        heading: ["var(--font-tajawal)", "sans-serif"],
        body: ["var(--font-cairo)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        hard: "8px 8px 0 #1e1b16",
        "hard-sm": "3px 3px 0 #1e1b16",
        "hard-md": "6px 6px 0 #1e1b16",
        "hard-orange": "8px 8px 0 #FF6A1A",
        "btn-orange": "0 6px 0 #D9500A",
        "btn-orange-pressed": "0 2px 0 #D9500A",
      },
      borderWidth: {
        "2.5": "2.5px",
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(-100%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker: "ticker 32s linear infinite",
        "ticker-slow": "ticker 45s linear infinite",
        "ticker-fast": "ticker 25s linear infinite",
        "fade-up": "fade-up .45s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
