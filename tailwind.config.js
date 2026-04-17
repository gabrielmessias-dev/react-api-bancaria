/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7F3DFF",
        secondary: "#121212",
      },
    },
  },
  plugins: [],
};