/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Let's define the "Syllabus Spine" Brand Colors early!
        primary: "#1e293b", // Deep Slate (The "Spine")
        accent: "#3b82f6",  // Royal Blue (Professional)
      }
    },
  },
  plugins: [],
}