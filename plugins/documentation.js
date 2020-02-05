'use strict'

/**
 * add swagger plugin to fastify instance
 * return function to be applied after fastify is ready
 * @param {Fastify} - fastify instance
 * @return {function()}
 */
const documentation = function (fastify) {
  fastify.register(require('fastify-swagger'), {
    swagger: {
      info: {
        title: 'Prague POI API',
        description: 'Prague POI API - testing api',
        version: '1.0.0'
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    },
    exposeRoute: true
  })

  return () => { fastify.swagger() }
}

module.exports = documentation
