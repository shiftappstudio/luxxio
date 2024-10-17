/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ece4ff",
          100: "#e0cfff",
          200: "#c9a8ff",
          300: "#ad74ff",
          400: "#a33eff",
          500: "#a413ff",
          600: "#a300ff",
          700: "#a300ff",
          800: "#9200e4",
          900: "#7700b0",
          950: "#1a0025",
        },
        accent: {
          50: "#fef1fa",
          100: "#fee5f7",
          200: "#ffcaf2",
          300: "#ff9fe6",
          400: "#ff63d2",
          500: "#ff2bb9",
          600: "#f0129c",
          700: "#d1057e",
          800: "#ad0767",
          900: "#8f0c58",
          950: "#580031",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
