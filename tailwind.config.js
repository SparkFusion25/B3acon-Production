/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // B3ACON Brand Colors
        'signal-blue': '#3478F6',
        'beacon-orange': '#FF6B35',
        'jet-black': '#121212',
        'slate-gray': '#2E2E2E',
        
        // Override default colors with B3ACON theme
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3478F6', // Signal Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B35', // Beacon Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#2E2E2E', // Slate Gray
          900: '#121212', // Jet Black
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3478F6 0%, #FF6B35 100%)',
        'gradient-dark': 'linear-gradient(135deg, #121212 0%, #2E2E2E 100%)',
      }
    },
  },
  plugins: [],
};
