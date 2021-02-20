const config = require('./config');
const fastify = require('fastify')({ logger: true });
const { placeQuery, placesQuery } = require('./queries');

fastify.register(require('./fastify-stardog'), {
  host: config.stardog.host,
  port: config.stardog.port,
  username: config.stardog.username,
  password: config.stardog.password,
  database: config.stardog.database,
});

fastify.get('/places', async (request, reply) => {
  const { stardog } = fastify;
  const data = await stardog.executeQuery(placesQuery);
  return data;
});

fastify.get('/place', async (request, reply) => {
  const { placeId, placeType } = request.query;
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

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};

start();

