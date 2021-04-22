'use strict'

const path = require('path')
const plugin = require('fastify-plugin')

/**
 * add swagger plugin to fastify instance
 * return function to be applied after fastify is ready
 * @param {Fastify} - fastify instance
 * @return {function()}
 */
const documentation = async function (fastify) {
  fastify.register(require('fastify-swagger'), {
    swagger: {
      info: {
        title: 'Prague POI API',
        description: 'Prague POI API - testing api',
        version: require(path.join(__dirname, '../package.json')).version
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  })

  return () => { fastify.swagger() }
}

module.exports = plugin(documentation)
