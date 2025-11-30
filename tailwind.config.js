/** @type {import('tailwindcss').Config} */
module.exports = {
  // This content array tells Tailwind CSS where to look for class names
  // It scans all JavaScript, TypeScript, and JSX files in the 'app' directory 
  // to build the smallest possible CSS output.
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
