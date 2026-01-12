import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1bda5b", // El Verde Cívico oficial
        "navy-dark": "#0d1b2a",
        "card-dark": "#1b263b",
        "field-dark": "#2a364a",
        "border-dark": "#415a77",
        "text-light": "#e0e1dd",
        "text-muted": "#778da9",
      },
    },
  },
  plugins: [],
}