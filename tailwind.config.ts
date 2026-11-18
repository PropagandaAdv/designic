import type { Config } from 'tailwindcss';

// Design token: single source of truth (colori ufficiali dal Brand Summary Designic).
const config: Config = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dusty-blue': '#544B71',
        'dusty-blue-light': '#776E96',
        'dusty-green': '#D9D6AB',
        'dusty-green-light': '#EFECBB',
        'dusty-pink': '#D3ADB8',
        'dusty-pink-light': '#E6C9D2',
        'blue-sky': '#D7DCEC',
        'blue-sky-light': '#F5F7FF',
        paper: '#F3F3EB',
        ink: '#1A1A1A',
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'] },
      letterSpacing: { label: '0.35em' },
    },
  },
  plugins: [],
};
export default config;
