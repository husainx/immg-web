/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./components/**/*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#183A7D",
        secondary: "#916d0f",
        accent: "#2B5FC7",
        darkGray: "#102539",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #183A7D 0%, #2B5FC7 100%)",
        "banner-gradient": "linear-gradient(90deg, #183A7D 0%, #2B5FC7 100%)",
        "gold-gradient": "linear-gradient(90deg, #F5C443 0%, #FFD700 100%)",
        "card-gradient": "linear-gradient(135deg, #F3F6FB 0%, #E5EFFF 100%)",
      },
      fontFamily: {
        sans: [
          "SF Pro",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
