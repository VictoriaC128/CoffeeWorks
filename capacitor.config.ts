import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.coffeeworks.app',
  appName: 'CoffeeWorks',
  webDir: 'dist',
  backgroundColor: '#ffffff',
  android: {
    // Keep the WebView rendering while the brew timer runs with the screen locked or the app in the background.
    allowMixedContent: false,
  },
  plugins: {
    SystemBars: {
      // Edge-to-edge: the app pads itself using the injected --safe-area-inset-* CSS variables.
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    SplashScreen: {
      launchShowDuration: 600,
      launchAutoHide: true,
      backgroundColor: '#151515',
      showSpinner: false,
    },
  },
};

export default config;
