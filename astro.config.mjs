import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';

// Same architecture as the reference build: Astro 4 + SolidJS islands + Tailwind.
export default defineConfig({
  integrations: [solid(), tailwind({ applyBaseStyles: false })],
  build: { inlineStylesheets: 'auto', assets: 'assets' },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
