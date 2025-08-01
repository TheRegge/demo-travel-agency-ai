import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tropical Color System - matching your v4 theme
        tropical: {
          sky: '#E0F2FE',
          ocean: '#0EA5E9',
          sunset: '#FB923C',
          palm: '#34D399',
          sand: '#FEF3C7',
        },
        // Enhanced color palette
        sky: {
          50: '#E0F2FE',
          300: '#7DD3FC',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        orange: {
          400: '#FB923C',
        },
        pink: {
          400: '#F472B6',
        },
        yellow: {
          400: '#FBBF24',
        },
        amber: {
          50: '#FEF3C7',
          600: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '0.5rem',
        'DEFAULT': '1rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '3rem',
        'xl': '6rem',
      },
      animation: {
        'cloud-drift': 'cloudDrift 25s linear infinite',
        'palm-sway': 'palmSway 5s ease-in-out infinite',
        'wave-motion': 'waveMotion 3s ease-in-out infinite',
        'button-press': 'buttonPress 0.2s ease-out',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        cloudDrift: {
          '0%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        palmSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        waveMotion: {
          '0%, 100%': { transform: 'translateY(0px) scaleY(1)' },
          '50%': { transform: 'translateY(-3px) scaleY(1.05)' },
        },
        buttonPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'tropical': '0 4px 6px -1px rgba(14, 165, 233, 0.1), 0 2px 4px -1px rgba(14, 165, 233, 0.06)',
        'tropical-lg': '0 10px 15px -3px rgba(14, 165, 233, 0.1), 0 4px 6px -2px rgba(14, 165, 233, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;