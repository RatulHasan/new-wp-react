/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,css,scss,sass}"],
  mode: process.env.NODE_ENV ? 'jit' : undefined,
  theme: {
    fontFamily: {
      sans: ['SF Pro Text','Times New Roman', 'sans-serif'],
    },
    extend: {
      zIndex: {
        '100': '100',
      }
    },
    theme: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
      },
      extend: {
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

