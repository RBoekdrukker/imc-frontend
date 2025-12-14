// tailwind.config.js
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          menu: "#0B1826",
          primary: "#336699",
          accent: "#557CA3",
          background: "#f8f9fa",
          muted: "#6c757d",
        },
        text: {
          primary: "#336699",
          muted: "#6c757d",
          light: "#ffffff",
        },
        bg: {
          light: "#ffffff",
          dark: "#1f1f1f",
        },
        border: {
          default: "#e0e0e0",
            muted: "#bdbdbd",
        },
        action: {
          hover: "#e9ecef",
        },
        gray: {
          1: "#f5f5f5",
          2: "#e0e0e0",
          3: "#bdbdbd",
          4: "#9e9e9e",
          5: "#616161",
          6: "#424242",
        },
      },
      fontFamily: { sans: ['"Open Sans"', "sans-serif"] },
      fontSize: {
        hero: ["3rem", "1.2"],
        "section-title": ["2rem", "1.3"],
        body: ["1rem", "1.6"],
      },
      spacing: { section: "6rem", "gap-lg": "2rem" },
    },
  },
  plugins: [],
};
