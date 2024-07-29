import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "rgb(56, 213, 174)",
          foreground: "rgb(245, 245, 245)",
        },
        secondary: {
          DEFAULT: "rgb(245, 245, 245)",
        },
        tertiary: {
          DEFAULT: "rgb(21, 186, 208)",
        },
        operatedVessel: "rgba(0, 193, 210, 1)",
        operatedVesselForecast: "rgba(0, 193, 210, 0.5)",
        partnerVessel: "rgba(245, 188, 92, 1)",
        partnerVesselForecast: "rgba(245, 188, 92, 0.5)",
        otherVessel: "rgb(154, 128, 255)",
        otherVesselForecast: "rgb(154, 128, 255, 0.5)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        base: "16px", // Puedes usar 'text-base' para aplicar este tamaño de fuente
        lg: "18px",
        xl: "20px",
      },
      fontWeight: {
        normal: "400", // Puedes usar 'font-normal' para aplicar este peso de fuente
        bold: "700", // Puedes usar 'font-bold' para aplicar este peso de fuente
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
