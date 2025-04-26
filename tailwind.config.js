/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#27AE60',
        'primary-dark': '#219653',
        'primary-light': '#6FCF97',
        secondary: '#2C3E50',
        accent: '#3498DB',
        'zen-green': {
          400: '#6FCF97',
          500: '#27AE60',
        }
      },
    },
  },
  plugins: [],
};
