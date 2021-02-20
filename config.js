const config = {
   stardog: {
    host: process.env.STARDOG_HOST || '127.0.0.1',
    port: process.env.STARDOG_PORT || '5820',
    database: process.env.STARDOG_DATABASE || 'nsp',
    username: process.env.STARDOG_USER || 'admin',
    password: process.env.STARDOG_PASSWORD || 'admin',
  },
};

module.exports = config;
