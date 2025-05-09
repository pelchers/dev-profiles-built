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
        red1: '#FFB3B3',
        red2: '#FF8080',
        red3: '#FF4C4C',
        red4: '#CC0000',
        red5: '#990000',
        orange1: '#FFDCB0',
        orange2: '#FFC980',
        orange3: '#FFA500',
        orange4: '#CC8400',
        orange5: '#996300',
        yellow1: '#FCFFB0',
        yellow2: '#FAFF83',
        yellow3: '#F9FF33',
        yellow4: '#C3CC00',
        yellow5: '#939900',
        green1: '#B3FFD0',
        green2: '#80FFAE',
        green3: '#00FF5F',
        green4: '#00CC4C',
        green5: '#009939',
        blue1: '#B3F0FF',
        blue2: '#80E4FF',
        blue3: '#00CFFF',
        blue4: '#00A6CC',
        blue5: '#007C99',
        indigo1: '#E5C2FF',
        indigo2: '#D594FF',
        indigo3: '#C54FFF',
        indigo4: '#9C00FF',
        indigo5: '#7500BF',
        r1: '#FFB3B3',
        r2: '#FF8080',
        r3: '#FF4C4C',
        r4: '#CC0000',
        r5: '#990000',
        o1: '#FFDCB0',
        o2: '#FFC980',
        o3: '#FFA500',
        o4: '#CC8400',
        o5: '#996300',
        y1: '#FCFFB0',
        y2: '#FAFF83',
        y3: '#F9FF33',
        y4: '#C3CC00',
        y5: '#939900',
        g1: '#B3FFD0',
        g2: '#80FFAE',
        g3: '#00FF5F',
        g4: '#00CC4C',
        g5: '#009939',
        b1: '#B3F0FF',
        b2: '#80E4FF',
        b3: '#00CFFF',
        b4: '#00A6CC',
        b5: '#007C99',
        i1: '#E5C2FF',
        i2: '#D594FF',
        i3: '#C54FFF',
        i4: '#9C00FF',
        i5: '#7500BF',
        v3: '#8F00FF',
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
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 1.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-in forwards',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin 5s linear infinite',
        
        'hover-lift': 'hover-lift 0.2s ease-out forwards',
        'hover-glow': 'hover-glow 0.3s ease-out forwards',
        'hover-bounce': 'hover-bounce 0.5s ease-in-out infinite',
        'hover-shake': 'hover-shake 0.3s ease-in-out',
        'hover-pulse': 'hover-pulse 0.8s ease-in-out infinite',
        'hover-spin': 'hover-spin 0.6s linear',
        
        'banner-slide-left': 'banner-slide-left 20s linear infinite',
        'banner-slide-right': 'banner-slide-right 20s linear infinite',
        'banner-fade': 'banner-fade 10s ease-in-out infinite',
        'banner-scale': 'banner-scale 8s ease-in-out infinite',
        'banner-attention': 'banner-attention 5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        
        'grid-appear': 'grid-appear 0.6s ease-out forwards',
        'grid-cascade': 'fade-in 0.8s ease-out forwards var(--animation-delay, 0)',
        'grid-stagger': 'slide-in 0.4s ease-out forwards var(--animation-delay, 0)',
        'grid-pop': 'grid-pop 0.5s ease-out forwards var(--animation-delay, 0)',
        
        'grid-hover-zoom': 'grid-hover-zoom 0.3s ease-out forwards',
        'grid-hover-lift': 'grid-hover-lift 0.2s ease-out forwards',
        'grid-hover-glow': 'grid-hover-glow 0.3s ease-out forwards',
        'grid-hover-rotate': 'grid-hover-rotate 0.4s ease-out forwards',
        'grid-hover-expand': 'grid-hover-expand 0.3s ease-out forwards',
        'grid-hover-shine': 'grid-hover-shine 0.8s ease-out forwards',
        
        'masonry-cascade': 'fade-in 0.8s ease-out forwards var(--masonry-delay, 0)',
        'masonry-pop': 'masonry-pop 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards var(--masonry-delay, 0)',
        'masonry-fade': 'masonry-fade 0.7s ease-out forwards var(--masonry-delay, 0)',
        'masonry-slide': 'masonry-slide 0.5s ease-out forwards var(--masonry-delay, 0)',
        'masonry-reveal': 'masonry-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards var(--masonry-delay, 0)',
        
        'grid-breathe': 'grid-breathe 8s ease-in-out infinite var(--breathing-delay, 0)',
        'grid-float': 'float 6s ease-in-out infinite var(--floating-delay, 0)',
        'grid-subtle-rotate': 'grid-subtle-rotate 10s linear infinite var(--rotating-delay, 0)',
        'grid-pulse': 'grid-pulse 4s ease-in-out infinite var(--pulse-delay, 0)',
        
        'gallery-zoom': 'gallery-zoom 0.5s ease-out forwards',
        'gallery-slide': 'gallery-slide 0.6s ease-out forwards',
        'gallery-rotate': 'gallery-rotate 0.5s ease-out forwards',
        'gallery-flip': 'gallery-flip 0.6s ease-out forwards',
        
        'scroll-fade-up': 'scroll-fade-up 0.8s ease-out forwards',
        'scroll-fade-left': 'scroll-fade-left 0.8s ease-out forwards',
        'scroll-fade-right': 'scroll-fade-right 0.8s ease-out forwards',
        'scroll-zoom-in': 'scroll-zoom-in 0.8s ease-out forwards',
        'scroll-reveal': 'scroll-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        
        'load-in': 'load-in 0.5s ease-out forwards',
        'load-out': 'load-out 0.5s ease-in forwards',
        'load-in-out': 'load-in 0.5s ease-out forwards, load-out 0.5s ease-in forwards 3s',
        'notify-in': 'notify-in 0.3s ease-out forwards',
        'notify-out': 'notify-out 0.3s ease-in forwards',
        'toast-in-out': 'toast-in 0.3s ease-out forwards, toast-out 0.3s ease-in forwards 3s',
        
        'bounce-rotate': 'bounce-rotate 2s ease-in-out infinite',
        'disco-spin': 'disco-spin 1.5s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'rubber-band': 'rubber-band 1.2s ease-in-out',
        'jelly': 'jelly 0.8s ease-in-out',
        'glitch': 'glitch 1s steps(2, jump-none) infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
        'rainbow': 'rainbow 5s ease infinite',
      },
      keyframes: {
        'tag-grow': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px 0px currentColor',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 15px 2px currentColor',
            transform: 'scale(1.02)'
          },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        
        'hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'hover-glow': {
          '0%': { boxShadow: '0 0 0px 0px currentColor' },
          '100%': { boxShadow: '0 0 8px 2px currentColor' },
        },
        'hover-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'hover-shake': {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(-2deg)' },
          '75%': { transform: 'rotate(2deg)' },
        },
        'hover-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        'hover-spin': {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        
        'banner-slide-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'banner-slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'banner-fade': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 },
        },
        'banner-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'banner-attention': {
          '0%, 90%, 100%': { 
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(0, 207, 255, 0)'
          },
          '45%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 10px 5px rgba(0, 207, 255, 0.4)'
          },
        },
        
        'grid-appear': {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'grid-pop': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '60%': { transform: 'scale(1.1)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        
        'gallery-zoom': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'gallery-slide': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'gallery-rotate': {
          '0%': { transform: 'rotate(-5deg) scale(0.9)', opacity: 0 },
          '100%': { transform: 'rotate(0) scale(1)', opacity: 1 },
        },
        'gallery-flip': {
          '0%': { transform: 'perspective(400px) rotateY(90deg)', opacity: 0 },
          '100%': { transform: 'perspective(400px) rotateY(0)', opacity: 1 },
        },
        
        'scroll-fade-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'scroll-fade-left': {
          '0%': { transform: 'translateX(-20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'scroll-fade-right': {
          '0%': { transform: 'translateX(20px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'scroll-zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'scroll-reveal': {
          '0%': { transform: 'translateY(20px)', opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          '100%': { transform: 'translateY(0)', opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        
        'load-in': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'load-out': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(-10px)', opacity: 0 },
        },
        'notify-in': {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'notify-out': {
          '0%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        'toast-in': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'toast-out': {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(20px)', opacity: 0 },
        },
        
        'bounce-rotate': {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-15px) rotate(10deg)' },
        },
        'disco-spin': {
          '0%': { transform: 'rotate(0)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)', filter: 'hue-rotate(360deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.1)' },
        },
        'rubber-band': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scaleX(1.25) scaleY(0.75)' },
          '40%': { transform: 'scaleX(0.75) scaleY(1.25)' },
          '50%': { transform: 'scaleX(1.15) scaleY(0.85)' },
          '65%': { transform: 'scaleX(0.95) scaleY(1.05)' },
          '75%': { transform: 'scaleX(1.05) scaleY(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'jelly': {
          '0%': { transform: 'scale(1, 1)' },
          '30%': { transform: 'scale(1.25, 0.75)' },
          '40%': { transform: 'scale(0.75, 1.25)' },
          '50%': { transform: 'scale(1.15, 0.85)' },
          '65%': { transform: 'scale(0.95, 1.05)' },
          '75%': { transform: 'scale(1.05, 0.95)' },
          '100%': { transform: 'scale(1, 1)' },
        },
        'glitch': {
          '0%, 100%': { 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            transform: 'translate(0)'
          },
          '20%': { 
            clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 95%)',
            transform: 'translate(-5px, 5px)'
          },
          '40%': { 
            clipPath: 'polygon(0 0, 100% 5%, 100% 95%, 0 100%)',
            transform: 'translate(5px, 0)'
          },
          '60%': { 
            clipPath: 'polygon(0 15%, 100% 5%, 100% 85%, 0 95%)',
            transform: 'translate(0, -5px)'
          },
          '80%': { 
            clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0 85%)',
            transform: 'translate(-5px, 0)'
          }
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        'blink-caret': {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' }
        },
        'rainbow': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' }
        },
        'grid-hover-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'grid-hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        'grid-hover-glow': {
          '0%': { boxShadow: '0 0 0px 0px rgba(0, 207, 255, 0)' },
          '100%': { boxShadow: '0 0 12px 4px rgba(0, 207, 255, 0.6)' },
        },
        'grid-hover-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        'grid-hover-expand': {
          '0%': { transform: 'scale(1)', zIndex: '0' },
          '100%': { transform: 'scale(1.1)', zIndex: '10' },
        },
        'grid-hover-shine': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'masonry-pop': {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '70%': { transform: 'scale(1.05)', opacity: 1 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'masonry-fade': {
          '0%': { opacity: 0, filter: 'blur(5px)' },
          '100%': { opacity: 1, filter: 'blur(0)' },
        },
        'masonry-slide': {
          '0%': { transform: 'translateY(25px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'masonry-reveal': {
          '0%': { transform: 'translateY(15px)', opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          '50%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 5%)' },
          '100%': { transform: 'translateY(0)', opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        'grid-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'grid-subtle-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(0.5deg)' },
          '75%': { transform: 'rotate(-0.5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'grid-pulse': {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(0, 207, 255, 0)' },
          '50%': { boxShadow: '0 0 8px 2px rgba(0, 207, 255, 0.3)' },
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
    function({ addUtilities, theme }) {
      const colors = theme('colors');
      const outlineUtilities = {};

      // Create outline utility classes for each color and shade in our system
      const colorPrefixes = ['r', 'g', 'b', 'y', 'o', 'i'];
      const shades = [1, 2, 3, 4, 5];

      // Generate utilities for each color prefix and shade
      colorPrefixes.forEach(prefix => {
        shades.forEach(shade => {
          const colorKey = `${prefix}${shade}`;
          if (colors[colorKey]) {
            outlineUtilities[`.ol-${colorKey}`] = {
              'outline': `2px solid ${colors[colorKey]}`,
              'outline-offset': '1px',
            };
            // Add thin variant
            outlineUtilities[`.ol-${colorKey}-thin`] = {
              'outline': `1px solid ${colors[colorKey]}`,
              'outline-offset': '1px',
            };
            // Add thick variant
            outlineUtilities[`.ol-${colorKey}-thick`] = {
              'outline': `3px solid ${colors[colorKey]}`,
              'outline-offset': '1px',
            };
            // Add dashed variant
            outlineUtilities[`.ol-${colorKey}-dashed`] = {
              'outline': `2px dashed ${colors[colorKey]}`,
              'outline-offset': '1px',
            };
            // Add dotted variant
            outlineUtilities[`.ol-${colorKey}-dotted`] = {
              'outline': `2px dotted ${colors[colorKey]}`,
              'outline-offset': '1px',
            };
          }
        });
      });

      // Add a few special outlines for neon/glow effects
      const glowUtilities = {
        '.ol-glow-b': {
          'outline': '1px solid rgba(0, 207, 255, 0.8)',
          'box-shadow': '0 0 8px rgba(0, 207, 255, 0.6)',
        },
        '.ol-glow-r': {
          'outline': '1px solid rgba(255, 76, 76, 0.8)',
          'box-shadow': '0 0 8px rgba(255, 76, 76, 0.6)',
        },
        '.ol-glow-g': {
          'outline': '1px solid rgba(0, 255, 95, 0.8)',
          'box-shadow': '0 0 8px rgba(0, 255, 95, 0.6)',
        },
        '.ol-glow-y': {
          'outline': '1px solid rgba(249, 255, 51, 0.8)',
          'box-shadow': '0 0 8px rgba(249, 255, 51, 0.6)',
        },
      };

      addUtilities({ ...outlineUtilities, ...glowUtilities });
    }
  ],
}; 