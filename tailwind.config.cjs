/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/index.html',
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          green: '#00FF5F',
          blue: '#00CFFF',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0F0F0F',
        },
        neon: {
          red: '#FF4C4C',
          orange: '#FFA500',
          yellow: '#F9FF33',
          green: '#00FF5F',
          blue: '#00CFFF',
          indigo: '#C54FFF',
          white: '#E0E0E0',
          black: '#0F0F0F',
        },
      },
      fontFamily: {
        brand: ['Honk', 'Space Grotesk', 'Rajdhani', 'sans-serif'],
        body: ['Inter', 'Rubik', 'sans-serif'],
        mono: ['VT323', 'Orbitron', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 8px 2px #00CFFF, 0 0 16px 4px #C54FFF',
      },
      borderRadius: {
        full: '9999px',
        lg: '0.75rem',
      },
      maxWidth: {
        '6xl': '72rem',
      },
      spacing: {
        'section-x': '2rem',
        'section-x-md': '4rem',
        'section-x-lg': '8rem',
      },
      animation: {
        'tag-grow': 'tag-grow 0.2s ease-out forwards',
      },
      keyframes: {
        'tag-grow': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}; 