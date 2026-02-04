import defaultTheme from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import scrollBar from 'tailwind-scrollbar-hide';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  plugins: [animate, forms, typography, scrollBar],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      // spacing: {
      //   7.5: '1.875rem',
      //   18: '4.5rem',
      // },
      fontSize: {
        xxs: '0.625rem', // * 10px
        '2lg': '1.188rem', // * 19px
        '2.75xl': '1.688rem', // * 27px
      },
      colors: {
        black: '#000000',
        grey: {
          50: '#F3F5F5',
          75: '#CDD0D0',
          100: '#D8D8D8',
          400: '#939393',
          800: '#808080',
        },
        brand: {
          100: '#F3F5F5',
          400: '#00C5BD',
          600: '#00AFA7',
          800: '#00857F',
        },
        blue: {
          400: '#7996F3',
        },
        yellow: {
          400: '#D7D367',
        },
      },
      boxShadow: {
        card: 'rgba(0, 0, 0, 0.08) 0px 4px 12px 4px',
        light: '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        soft: '0px 2px 5px 0px rgba(7, 127, 172, 0.43)',
        medium: '0px 4px 12px 0px rgba(168, 168, 168, 0.25)',
        '3xl': '0px 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 12px rgba(0, 0, 0, 0.08)',
        control: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        border: '0px 40px 80px 0px rgba(0, 60, 57, 0.15), 0px 0px 0px 1px rgba(0, 0, 0, 0.10)',
      },
      width: {
        7.5: '1.875rem',
        10.5: '2.625rem',
        22: '5.5rem',
      },
      borderRadius: {
        '3xl': '1.25rem', // 20px
        '4xl': '1.5rem', // 24px
      },
      opacity: {
        15: '0.15',
      },
      letterSpacing: {
        2.5: '0.625rem',
      },
      keyframes: {
        'reverse-slide': {
          '0%, 20%, 40%, 60%, 80%': {
            left: '-600px',
          },
          '95%': {
            left: '100px',
          },
        },
      },
      animation: {
        'reverse-slide': 'reverse-slide 0.5s ease-in-out',
      },
    },
  },
};
