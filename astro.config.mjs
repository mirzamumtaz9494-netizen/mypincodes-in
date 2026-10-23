import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://mypincodes.in',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  integrations: [tailwind({
    applyBaseStyles: false
  })]
});
