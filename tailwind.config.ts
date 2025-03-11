import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      montserrat: ['var(--font-montserrat)'],
      hind: ['var(--font-hind)'],
      permanent_marker: ['var(--font-permanent-marker)'],
    },
    extend: {
      backgroundImage: {
        'login-image': "url('/images/sunset.jpg')",
      },
      plugins: [],
      screens: {
        'h-sm': { raw: '(max-height: 640px)' },
        'h-md': { raw: '(min-height: 641px) and (max-height: 768px)' },
        'h-lg': { raw: '(min-height: 769px)' },
      },
    },
  },
};

export default config;
