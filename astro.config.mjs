// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sadie27.github.io',
  base: '/Apuntes-PAW-',
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
  },
});
