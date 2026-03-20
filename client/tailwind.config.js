/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Deep slate for a modern, premium feel
        accent: "#3B82F6", // Crisp blue for CTAs (avoids standard golf green)
        charity: "#F43F5E", // Warm rose for charity-focused elements
        surface: "#FFFFFF", // Clean white for cards and dashboards
        background: "#F8FAFC", // Very light gray/blue for the app background
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Clean, highly readable typography
      },
    },
  },
  plugins: [],
};
