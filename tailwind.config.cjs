module.exports = {
  /** @type {import('tailwindcss').Config} */
  purge: [],
  darkMode: 'class',
    content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/index.html',
  ],

  theme: {
    colors: {
        primary: {
          light:  '#2C698D',
          DEFAULT:'#2C698D',
          dark:   '#1F516D',
        },
        secondary: {
          light:  '#BAE8E8',
          DEFAULT:'#BAE8E8',
          dark:   '#8FB8B8',
        },
        accent: {
          light:  '#FFB400',
          DEFAULT:'#FFB400',
          dark:   '#CC8E00',
        },
        background: {
          light: '#F4F6F8',
          dark:  '#121212',
        },
        surface: {
          light: '#FFFFFF',
          dark:  '#1E1E1E',
        },
        text: {
          light: '#212121',
          DEFAULT: '#212121',
          dark:  '#E0E0E0',
        },
        success: {
          DEFAULT: '#4CAF50',
        },
        warning: {
          DEFAULT: '#FFC107',
        },
        error: {
          DEFAULT: '#F44336',
        },
      },
    extend: {
      keyframes: {
        panGrid: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      animation: {
        'pan-grid': 'panGrid 60s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}