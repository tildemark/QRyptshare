import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ph.sanchez.qryptshare',
  appName: 'QRyptshare',
  webDir: 'out', // Next.js 'export' output folder
  server: {
    androidScheme: 'https'
  }
};

export default config;