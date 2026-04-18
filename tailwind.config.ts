import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/entities/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/processes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004c16",
        "on-primary": "#ffffff",
        "primary-container": "#0b6623",
        "on-primary-container": "#8de28f",
        "primary-fixed": "#a1f6a1",
        "primary-fixed-dim": "#86d988",
        "on-primary-fixed": "#002106",
        "on-primary-fixed-variant": "#005319",
        "inverse-primary": "#86d988",
        "secondary": "#a04100",
        "on-secondary": "#ffffff",
        "secondary-container": "#fe6b00",
        "on-secondary-container": "#572000",
        "secondary-fixed": "#ffdbcc",
        "secondary-fixed-dim": "#ffb693",
        "on-secondary-fixed": "#351000",
        "on-secondary-fixed-variant": "#7a3000",
        "tertiary": "#771e3d",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#953654",
        "on-tertiary-container": "#ffbccb",
        "tertiary-fixed": "#ffd9e0",
        "tertiary-fixed-dim": "#ffb1c3",
        "on-tertiary-fixed": "#3f0019",
        "on-tertiary-fixed-variant": "#7f2543",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "background": "#f9f9fc",
        "on-background": "#1a1c1e",
        "surface": "#f9f9fc",
        "on-surface": "#1a1c1e",
        "surface-dim": "#dadadc",
        "surface-bright": "#f9f9fc",
        "surface-tint": "#176d29",
        "surface-variant": "#e2e2e5",
        "on-surface-variant": "#40493e",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f6",
        "surface-container": "#eeeef0",
        "surface-container-high": "#e8e8ea",
        "surface-container-highest": "#e2e2e5",
        "inverse-surface": "#2f3133",
        "inverse-on-surface": "#f0f0f3",
        "outline": "#707a6d",
        "outline-variant": "#bfcaba"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Pretendard",
          "Apple SD Gothic Neo",
          "sans-serif"
        ],
        headline: [
          "var(--font-jakarta)",
          "var(--font-manrope)",
          "Pretendard",
          "sans-serif"
        ],
        display: [
          "var(--font-manrope)",
          "var(--font-jakarta)",
          "Pretendard",
          "sans-serif"
        ]
      },
      boxShadow: {
        panel: "0 24px 60px rgba(20, 33, 61, 0.08)",
        ambient: "0 8px 24px rgba(26, 28, 30, 0.04)",
        lift: "0 4px 20px rgba(0, 0, 0, 0.02)"
      }
    }
  },
  plugins: []
};

export default config;
