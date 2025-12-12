/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '000': '#F5FEFF',
          100: '#C2F1F7',
          200: '#99E7F2',
          300: '#66DAEB',
          400: '#33CDE5',
          500: '#00B4D8',
          600: '#0090AD',
          700: '#006C82',
          800: '#004857',
          900: '#00242B',
        },
        success: {
          100: '#D4EDDA',
          500: '#28A745',
          700: '#1E7E34',
        },
        warning: {
          100: '#FFF3CD',
          500: '#FFC107',
          700: '#D39E00',
        },
        critical: {
          100: '#F8D7DA',
          500: '#DC3545',
          700: '#BD2130',
        },
        info: {
          100: '#D1ECF1',
          500: '#17A2B8',
          700: '#117A8B',
        },
        neutral: {
          '000': '#FFFFFF',
          '050': '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#000000',
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Source Code Pro"', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.25rem',
        'lg': '0.5rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
    },
  },
  plugins: [],
}
