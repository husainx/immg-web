/** @type {import('tailwindcss').Config} */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#1C387C", // Deep blue
        secondary: "#F5C443", // Gold/yellow
        accent: "#2B5FC7", // Accent blue
        muted: "#F5F7FA", // Light background
        footer: "#0B1C3A", // Footer dark blue
        card: "#FFFFFF", // Card white
        "gray-100": "#F3F4F6",
        "gray-200": "#E5E7EB",
        "gray-300": "#D1D5DB",
        "gray-500": "#6B7280",
        "gray-900": "#111827",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px 0 rgba(24, 58, 125, 0.08)",
      },
      backgroundImage: {
        "card-gradient": "linear-gradient(90deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-2": "linear-gradient(320deg, #0C286B 20%, #3266E2 99%)",
        "card-gradient-3": "linear-gradient(270deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-4": "linear-gradient(360deg, #0C286B 0%, #3266E2 99%)", // 90deg
        "card-gradient-5": "linear-gradient(450deg, #0C286B 0%, #3266E2 99%)", // 180deg
        "card-gradient-6": "linear-gradient(540deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-7": "linear-gradient(630deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-8": "linear-gradient(720deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-9": "linear-gradient(810deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-10": "linear-gradient(900deg, #0C286B 0%, #3266E2 99%)",
        "card-gradient-11": "linear-gradient(990deg, #0C286B 0%, #3266E2 99%)",

        // "bd-gradient": "linear-gradient(90deg, #0C286B 0%, #3266E2 99%)",
        // Hero diagonal blue gradient
        "hero-gradient": "linear-gradient(135deg, #183A7D 0%, #2B5FC7 100%)",
        // Banner horizontal blue gradient
        "banner-gradient": "linear-gradient(90deg, #183A7D 0%, #2B5FC7 100%)",
        // Gold accent gradient (if needed)
        "gold-gradient": "linear-gradient(90deg, #F5C443 0%, #FFD700 100%)",
        // Card subtle blue
        // "card-gradient": "linear-gradient(135deg, #F3F6FB 0%, #E5EFFF 100%)",
      },
      maxWidth: {
        "3xl": "2560px",
      },
    },
  },
};
