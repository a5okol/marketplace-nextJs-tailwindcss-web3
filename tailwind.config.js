module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      maxWidth: {
        '8xl': '1920px',
      },
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
