import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'login-image':
          "url('https://cdn.pixabay.com/photo/2017/06/07/12/56/sunset-2380279_1280.jpg')",
      },
      plugins: [],
    },
  },
};

export default config;
