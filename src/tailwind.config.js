/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['EB Garamond', 'Times New Roman', 'serif'],
        'display': ['Cinzel', 'EB Garamond', 'serif'],
        'body': ['EB Garamond', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}