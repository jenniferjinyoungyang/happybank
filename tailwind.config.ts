import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        'h-sm': { raw: '(max-height: 640px)' },
        'h-md': { raw: '(min-height: 641px) and (max-height: 768px)' },
        'h-lg': { raw: '(min-height: 769px)' },
      },
    },
  },
};

export default config;
