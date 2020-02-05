'use strict'

const moment = require('moment')
const db = require('../lib/db')
const service = require('../lib/service')

/**
 * add events services to server
 * @param {Fastify} - fastify instance
 */
const events = function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/events',
    schema: {
      query: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              date: { type: 'string', format: 'date' },
              title: { type: 'string' },
              description: { type: 'string' }
            }
          }
        },
        400: service.schema[400],
        404: service.schema[404],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        const filter = {}
        if (request.query.date) {
          filter.date = request.query.date
        }
        const events = (await db.instance.events.find(filter))
          .map(event => ({
            id: event.id,
            date: moment(event.date).format('YYYY-MM-DD'),
            title: event.title,
            description: event.description
          }))
        response.send(events)
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })
}

module.exports = events
