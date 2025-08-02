// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Branding Colors
        'brand-menu': '#0B1826',      // dark blue menu
		'brand-primary': '#254463',      // deep corporate navy
        'brand-accent': '#557CA3',       // cool light blue
        'brand-background': '#f8f9fa',   // soft background white
        'brand-muted': '#6c757d',        // subtle silver (text-muted, borders, etc.)

        // Semantic Grays
        'gray-1': '#f5f5f5', // lightest
        'gray-2': '#e0e0e0',
        'gray-3': '#bdbdbd',
        'gray-4': '#9e9e9e',
        'gray-5': '#616161',
        'gray-6': '#424242', // darkest

        // Semantic Aliases
        'text-primary': '#254463',
        'text-muted': '#6c757d',
        'text-light': '#ffffff',
        'bg-light': '#ffffff',
        'bg-dark': '#1f1f1f',
        'border-default': '#e0e0e0',
        'border-muted': '#bdbdbd',
        'action-hover': '#e9ecef',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', '1.2'],   // ~48px
        'section-title': ['2rem', '1.3'], // ~32px
        'body': ['1rem', '1.6'],   // 16px
      },
      spacing: {
        'section': '6rem',
        'gap-lg': '2rem',
      },
    },
  },
  plugins: [],
};
