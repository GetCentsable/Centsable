const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      // Custom breakpoints
      screens: {
        'sm': '640px',
        'md': '768px',
        'md-lg': '960px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1610px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  // purge: ['./src/**/*.{js, jsx, ts, tsx}', './public/index.html'],
}