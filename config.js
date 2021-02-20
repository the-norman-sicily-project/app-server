const config = {
  port: process.env.PORT || 4000,
  stardog: {
    host: process.env.STARDOG_HOST || '127.0.0.1',
    port: process.env.STARDOG_PORT || '5820',
    database: process.env.STARDOG_DATABASE || 'nsp',
    username: process.env.STARDOG_USER || 'admin',
    password: process.env.STARDOG_PASSWORD || 'admin',
  },
  mapbox: {
    username: process.env.MAPBOX_USERNAME || 'YOUR MAPBOX USERNAME',
    styleId: process.env.MAPBOX_STYLE_ID || 'YOUR MAPBOX STYLE ID',
    apiAccessToken: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR MAPBOX TOKEN',
  }
};

module.exports = config;
