import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sustainableapp.ecolife',
  appName: 'EcoLife',
  webDir: 'build',
  server: {
    // Use HTTPS scheme for the WebView (Capacitor default); HTTP API calls use network security config.
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#f0f2f5',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
