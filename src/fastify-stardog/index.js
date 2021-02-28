'use strict'

const fastifyPlugin = require('fastify-plugin');
const { Connection, db, query } = require('stardog');
const fetch = require('node-fetch');
const querystring = require('querystring');

const mimeTypes = {
  "jsonld": "application/ld+json",
  "turtle": "text/turtle",
  "rdfxml": "application/rdf+xml",
  "ntriples": "application/n-triples",
  "nquads": "application/n-quads",
  "trig": "application/trig"
};

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

  async function exportData(format = 'trig', graphUri) {
    try {
      const response = await db.exportData(conn, database, { mimetype: mimeTypes[format] }, { graphUri });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.errors) {
        throw new Error(response.errors.map((e) => e.message));
      }
      return response;
    } catch (e) {
      throw new Error(e.message);
    }
  };

  async function executeGetQuery(q, v = {}, reasoning = true) {
    try {

      const url = `${conn.endpoint}/${database}/graphql`;
      const qs = querystring.stringify(Object.assign({}, { query: q }, { variables: JSON.stringify(v) }, { reasoning }));
      const ab = Buffer.from(`${conn.username}:${conn.password}`);

      const response = await fetch(`${url}?${qs}`, {
        headers: {
          "Authorization": `Basic ${ab.toString('base64')}`,
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.errors) {
        throw new Error(response.errors.map((e) => e.message));
      }
      const { data } = await response.json();
      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  }

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

  const stardog = { conn, db: database, executeQuery, exportData, executeGetQuery };

  fastify.decorate("stardog", stardog);
  next();
};

module.exports = fastifyPlugin(fastifyStardog, {
  fastify: '>=1.0.0',
  name: 'fastify-stardog'
});
