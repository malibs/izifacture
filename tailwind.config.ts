import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F3F0FF",
          100: "#E9E3FF",
          200: "#D5CAFF",
          300: "#B7A4FF",
          400: "#9575FC",
          500: "#7C5CFC",
          600: "#6841F0",
          700: "#5732D2",
          800: "#482CAB",
          900: "#3D288A",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F8FA",
          sunken: "#F1F2F6",
        },
        line: {
          DEFAULT: "#EDEEF2",
          strong: "#E2E4EA",
        },
        ink: {
          DEFAULT: "#141519",
          soft: "#5C606B",
          faint: "#8B8F9A",
        },
        status: {
          paid: "#12B76A",
          paidSoft: "#E7F8F0",
          sent: "#F79009",
          sentSoft: "#FEF3E2",
          draft: "#8B8F9A",
          draftSoft: "#F1F2F6",
          overdue: "#F04438",
          overdueSoft: "#FEECEB",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 21, 25, 0.04)",
        raised: "0 8px 24px -6px rgba(20, 21, 25, 0.12)",
        float: "0 16px 40px -12px rgba(20, 21, 25, 0.22)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
