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
    },
  },
};

export default config;
