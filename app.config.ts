import 'dotenv/config';

const myValue = 'Kuba Mobile';
export default {
  name: myValue,
  version: '1.0.0',
  slug: 'kuba-mobile',
  extra: {
    API_URL: process.env.API_URL,
    GATEWAY_URL: process.env.GATEWAY_URL,
  },
  splash: {
    image: './assets/splashscreen.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  icon: './assets/icon.png',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: 'com.marmelab.kuba',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
};
