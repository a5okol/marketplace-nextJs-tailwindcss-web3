const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: ['w-8', 'h-8', 'animate-spin', 'gap-2', 'bg-slate-700'],
  darkMode: false,
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
      },
      maxWidth: {
        '8xl': '1920px',
      },
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
