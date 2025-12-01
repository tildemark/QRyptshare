/** @type {import('tailwindcss').Config} */
module.exports = {
  // CORRECTED: Ensure all template files (including .tsx for React components) are scanned.
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom properties here if needed, like custom fonts or colors.
    },
  },
  plugins: [],
}