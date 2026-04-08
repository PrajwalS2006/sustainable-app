import { Capacitor } from '@capacitor/core';

/**
 * Base URL for the Express API (`/api` prefix included).
 * - Web dev: localhost
 * - Android emulator: 10.0.2.2 maps to host machine's loopback
 * - Physical device: set REACT_APP_API_URL to http://YOUR_LAN_IP:5000/api before `npm run build`
 */
export function getApiBaseUrl() {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, '');
  }

  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
}
