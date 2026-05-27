import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gold': {
          300: '#f5d485',
          400: '#e8b84e',
          500: '#d4a017',
        },
        'slate': {
          950: '#0b0f19',
          900: '#0f172a',
        }
      },
    },
  },
  plugins: [],
};

export default config;
