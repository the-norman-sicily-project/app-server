const fastify = require('fastify')({ logger: true });
const fetch = require("node-fetch");
const config = require('./config');
const { placeQuery, placesQuery } = require('./queries');

fastify.register(require('fastify-cors'), {
  method: 'GET',
  origin: ['http://normansicily.local:3000',
    'http://normansicily.org', 'https://normansicily.org',
    'https://www.normansicily.org', ' http://www.normansicily.org'],
  exposedHeaders: 'Content-Disposition',
});

fastify.register(require('fastify-compress'), {});

fastify.register(require('./fastify-stardog'), {
  host: config.stardog.host,
  port: config.stardog.port,
  username: config.stardog.username,
  password: config.stardog.password,
  database: config.stardog.database,
});

fastify.get('/places', async () => {
  const { stardog } = fastify;
  const data = await stardog.executeQuery(placesQuery);
  return data;
});

fastify.get('/places/:placeType/:placeId', async (request, reply) => {
  const { placeId, placeType } = request.params;
  if (placeId && placeType) {
    const { stardog } = fastify;
    const data = await stardog.executeQuery(placeQuery, { placeId, placeType });
    return data;
  }
  return reply.status(400).send({
    success: 'false',
    message: 'place ID and place type are required'
  });
});

fastify.get('/mapproxy/:z/:x/:y', async (request, reply) => {
  const { z, x, y } = request.params;
  const tileUrl = `https://api.mapbox.com/styles/v1/${config.mapbox.username}/${config.mapbox.styleId}/tiles/256/${z}/${x}/${y}@2x?access_token=${config.mapbox.apiAccessToken}`;
  const response = await fetch(tileUrl);
  const buffer = await response.buffer();
  if (!response.ok) {
    return reply.status(response.status).send(response.statusText);
  }
  return reply.status(response.status).type(response.type).send(buffer);
});

fastify.get('/export', async (request, reply) => {
  const { filename, format, graphUri } = request.query;
  const { stardog } = fastify;
  const response = await stardog.exportData(format, graphUri);

  reply.header('Content-Disposition', `attachment; filename=${filename}`);
  reply.type(response.headers.get('Content-Type'));
  reply.send(response.body);
});

const start = async () => {
  try {
    await fastify.listen(config.port, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};

start();
