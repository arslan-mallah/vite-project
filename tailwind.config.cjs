/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F7BE3',
          DEFAULT: '#2B61DE',
          dark: '#19419E',
        },
        blackBox: {
          light: '#414141',
          DEFAULT: '#2c2c2c',
          dark: '#000000',
        },
        secondary: {
          light: '#FFB547',
          DEFAULT: '#FF9100',
          dark: '#B76A00',
        },
        tertiary: {
          light: '#47E5BC',
          DEFAULT: '#00D1A9',
          dark: '#00A87A',
        },
        accent: {
          light: '#FF6B6B',
          DEFAULT: '#FF3B3B',
          dark: '#B72C2C',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/hero.jpg')",
        'footer-texture': "url('/src/assets/footer-texture.png')",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
    },
  },
  plugins: [],
}
