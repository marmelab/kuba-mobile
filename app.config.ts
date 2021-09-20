const appName = 'Kuba Mobile';

module.exports = () => {
  if (process.env.ENVIRONMENT === 'production') {
    return {
      name: appName,
      version: '1.0.0',
      extra: {
        API_URL: 'kittens are cool',
      },
    };
  } else {
    return {
      name: appName,
      version: '1.0.0',
      extra: {
        API_URL: 'http://192.168.86.189:3000',
      },
    };
  }
};
