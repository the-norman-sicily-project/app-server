'use strict'

const fastifyPlugin = require('fastify-plugin');
const { Connection, query } = require('stardog');

function fastifyStardog(
  fastify,
  {
    host = "localhost",
    port = 5820,
    username,
    password,
    database,
  },
  next
) {

  const conn = new Connection({
    username: username,
    password: password,
    endpoint: `http://${host}:${port}`,
  });

  async function executeQuery(q, v = {}, reasoning = true) {
    try {
      const response = await query.graphql.execute(conn, database, q, v, { reasoning });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.errors) {
        throw new Error(response.errors.map((e) => e.message));
      }
      const { body = {} } = response;
      const { data = [] } = body;
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const stardog = { conn, db: database, executeQuery };

  fastify.decorate("stardog", stardog);
  next();
};

module.exports = fastifyPlugin(fastifyStardog, {
  fastify: '>=1.0.0',
  name: 'fastify-stardog'
});
