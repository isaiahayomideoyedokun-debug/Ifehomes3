import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo950: "#161a2c",
        indigo900: "#1d2340",
        indigo800: "#283569",
        indigo600: "#3e52a3",
        indigo300: "#a9b6e8",
        gold: "#e8a33d",
        goldDim: "#c98a2c",
        laterite: "#c1502e",
        paper: "#f1eee4",
        paperDim: "#e7e2d3",
        ink: "#171512",
        inkSoft: "#4a4740",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-instrument)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "22px",
      },
    },
  },
  plugins: [],
};
export default config;
