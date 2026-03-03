import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB",
          "primary-dark": "#1D4ED8",
          "primary-light": "#3B82F6",
          dark: "#2E2D29",
          "cool-grey": "#4D4F53",
          warm: "#D2C295",
          "warm-light": "#F9F6EF",
          sandstone: "#D2C295",
          fog: "#F4F4F4",
        },
      },
      fontFamily: {
        sans: [
          "Source Sans Pro",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        serif: ["Source Serif Pro", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
