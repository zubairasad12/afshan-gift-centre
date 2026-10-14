import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAF7",
        cream: {
          DEFAULT: "#F5F0EB",
          50: "#FAF7F4",
          100: "#F5F0EB",
          200: "#EBE3D9",
          300: "#DDD1C2",
          400: "#C9B6A1",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          50: "#757575",
          100: "#5E5E5E",
          200: "#4D4D4D",
          800: "#2C2C2C",
          900: "#1A1A1A",
        },
        brown: {
          DEFAULT: "#3D3229",
          light: "#5A4C40",
          dark: "#2A221B",
        },
        accent: {
          DEFAULT: "#B8956A",
          hover: "#A07F56",
          light: "#D8C3A8",
          dark: "#8C6E48",
        },
        error: {
          DEFAULT: "#C75050",
          light: "#FBEBEB",
        },
        success: {
          DEFAULT: "#5A7A60",
          light: "#EFF5F1",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(44, 44, 44, 0.05), 0 1px 2px rgba(44, 44, 44, 0.03)",
        card: "0 4px 20px -2px rgba(44, 44, 44, 0.06)",
        cardHover: "0 12px 30px -4px rgba(44, 44, 44, 0.12)",
        drawer: "-4px 0 24px rgba(44, 44, 44, 0.12)",
      },
      aspectRatio: {
        "3/4": "3 / 4",
        "4/5": "4 / 5",
      },
    },
  },
  plugins: [],
};

export default config;
