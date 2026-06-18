/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        board: {
          brown: '#2D1B0E',
          'brown-light': '#4A3222',
          'brown-dark': '#1A0F06',
          amber: '#F5A623',
          'amber-light': '#FFC857',
          'amber-dark': '#D4901E',
          wine: '#8B2252',
          'wine-light': '#A83268',
          green: '#2ECC71',
          'green-dark': '#27AE60',
          cream: '#FFF8E7',
          muted: '#8B7355',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'progress-fill': 'progressFill 1s ease-out',
        'countdown-tick': 'countdownTick 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245, 166, 35, 0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(245, 166, 35, 0.8)' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
        countdownTick: {
          '0%': { transform: 'scale(1.2)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
