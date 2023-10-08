/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
 
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '2000px', 
      },
      animation: {
        'move-up': 'move-up 100ms ease-out forwards',
        'move-up2': 'move-up2 100ms ease-out forwards',
        'move-down': 'move-down 100ms ease-out forwards',
        'expand': 'expand 100ms ease-out forwards',
      },
      keyframes: {
        'move-up': {
          '0%': { top: '-3rem' },
          '100%': { top: '-7.5rem' },
        },
        'move-up2': {
          '0%': { top: '-3rem' },
          '100%': { top: '-11rem' },
        },
        'move-down': {
          '0%': { top: '-3rem' },
          '100%': { top: '.5rem' },
        },
        'expand': {
          '0%': { width: '0' },   
          '100%': { width: '151px' },    
        },
      },
    },
  },
  plugins: [],
}