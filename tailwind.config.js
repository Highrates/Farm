/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'geologica': ['Geologica', 'sans-serif'],
      },
      colors: {
        'main-bg': '#F2ECE3',
      }
    },
  },
  plugins: [],
}