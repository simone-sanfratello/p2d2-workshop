'use strict'

const path = require('path')
const qs = require('qs')
const env = process.env.NODE_ENV || 'dev'

require('custom-env')
  .env(env, path.join(__dirname, '../env'))

/**
 * Application settings
 * @typedef {Object} Settings
 * @property {Object} log - pino logger options, @see https://getpino.io/#/docs/api?id=loggerlevels-object
 * @property {Object} fastify - fastify options, @see https://www.fastify.io/docs/latest/Server
 * @property {Object} server - server network settings
 * @property {string} server.port - server port
 * @property {string} server.host - server host
 * @property {string[]} services - paths to services
 * @property {string[]} plugins - paths to plugins
 */

const settings = { env }

settings.log = {
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.LOG_PRETTY === 'true'
}

settings.fastify = {
  querystringParser: str => qs.parse(str)
}

settings.postgresql = {
  host: process.env.PG_HOST || '127.0.0.1',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
}

settings.server = {
  port: process.env.APP_PORT || 9001,
  host: '0.0.0.0'
}

settings.services = [
  path.join(__dirname, '../services/index'),
  path.join(__dirname, '../services/poi'),
  path.join(__dirname, '../services/events')
]

settings.plugins = [
  path.join(__dirname, '../plugins/documentation')
]

settings.monitor = {
  sql: true
}

module.exports = settings
