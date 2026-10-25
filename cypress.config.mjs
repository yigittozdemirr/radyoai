import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    viewportWidth: 390,
    viewportHeight: 844,
    setupNodeEvents(on) {
      // bigger headless window → the 390x844 phone is recorded at 100% instead of ~74%
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron') {
          launchOptions.preferences.width = 1400;
          launchOptions.preferences.height = 1000;
        }
        return launchOptions;
      });
    },
  },
  video: true,
});
