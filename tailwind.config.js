/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "gov-bg": "#0B1116",         // The deepest background
        "gov-surface": "#151F26",    // Cards/panels
        "gov-light": "#1C262E",      // Lighter panels/hover
        "gov-primary": "#1BDA5B",    // Neon Green (Action)
        "gov-secondary": "#10523C",  // Darker Green
        "gov-accent": "#D4AF37",     // Gold/Premium
        "gov-white": "#F8FAFC",      // Text Primary
        "gov-grey": "#94A3B8",       // Text Secondary
        "gov-danger": "#EF4444",     // Alerts
        // Keep existing handy just in case
        "primary": "#1bda5b",
      },
      fontFamily: {
        "display": ["Poppins", "sans-serif"],
        "heading": ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.375rem", // md
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}