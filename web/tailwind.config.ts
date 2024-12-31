import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-main-01':
          'linear-gradient(90deg, #1C48FA 0%, #2391F6 50%, #B072FF 100%)',
        'gradient-main-02':
          'linear-gradient(90deg, #01bdb1 16%, #01a6fe 50%, #dcb7ff 86%)',
        'main-right': 'linear-gradient(to right, #96fbc4, #f9f586)',
        'main-down': 'linear-gradient(to bottom, #f9f586, #96fbc4)',
        'background-light':
          'linear-gradient(to bottom right, #a1c4fd, #c2e9fb)',
        'background-dark':
          'linear-gradient(to bottom right, #1e3c72 , #1e3c72, #2a5298)',
        solana: 'linear-gradient(to top right, #9945FF, #14F195)',
        mask: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.8) 100%)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        main: {
          green: {
            '01': '#96fbc4',
            '02': '#395F18',
          },
          yellow: {
            '01': '#f9f586',
            '02': '#FEFFC4',
          },
          gray: {
            '01': '#D6DAE4',
            '02': '#A9ADB6',
            '03': '#585C66',
            '04': '#26272A',
            '05': '#2E323F',
            '06': '#5A627C',
            '07': '#C3C3C3',
            '08': '#8D8D8C',
            '09': '#54565F',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
