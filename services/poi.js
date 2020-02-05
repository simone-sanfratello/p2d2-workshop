'use strict'

const moment = require('moment')
const db = require('../lib/db')
const service = require('../lib/service')

/**
 * add poi services to server
 * @param {Fastify} - fastify instance
 */
const poi = function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/poi/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        },
        400: service.schema[400],
        404: service.schema[404],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        const poi = await db.instance.poi.findOne({ id: request.params.id }, { fields: ['id', 'name'] })
        if (!poi) {
          response
            .status(404)
            .send({ statusCode: 404, error: 'POI_NOT_FOUND' })
          return
        }
        response.send(poi)
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })

  fastify.route({
    method: 'POST',
    url: '/poi',
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        },
        400: service.schema[400],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        const poi = await db.instance.poi.insert({ name: request.body.name })
        response
          .status(201)
          .send(poi)
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })

  fastify.route({
    method: 'PATCH',
    url: '/poi/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        },
        400: service.schema[400],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        const _poi = {}
        if (request.body.name) {
          _poi.name = request.body.name
        }
        const poi = await db.instance.poi.update(request.params.id, _poi)
        response.send(poi)
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })

  fastify.route({
    method: 'DELETE',
    url: '/poi/:id',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        },
        400: service.schema[400],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        await db.instance.poi.destroy(request.params.id)
        response.send({ id: request.params.id })
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/poi',
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          page: { type: 'number', minimum: 1 },
          size: { type: 'number', maximum: 100, default: 100 },
          name: { type: 'string', minLength: 3 },
          sort: {
            oneOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                  pattern: 'name:(asc|desc)'
                }
              },
              {
                type: 'string',
                pattern: 'name:(asc|desc)'
              }
            ]
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            result: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' }
                }
              }
            },
            paging: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                total: { type: 'number' }
              }
            }
          }
        },
        400: service.schema[400],
        500: service.schema[500]
      }
    },
    handler: async (request, response) => {
      try {
        let page = 1
        const paging = { offset: 0, limit: 100 }
        if (request.query.size) {
          paging.limit = request.query.size
        }
        if (request.query.page) {
          page = request.query.page
          paging.offset = (request.query.page - 1) * paging.limit
        }

        const filter = { where: '', values: [] }
        if (request.query.name) {
          filter.where = 'name ILIKE $1'
          filter.values.push(`%${request.query.name}%`)
        }

        let order = []
        if (request.query.sort) {
          if (!Array.isArray(request.query.sort)) {
            request.query.sort = [request.query.sort]
          }
          order = request.query.sort.map(sort => {
            const [field, direction] = sort.split(':')
            return { field, direction }
          })
        }

        const poi = await db.instance.poi.where(
          filter.where || 'TRUE',
          filter.values,
          { ...paging, order }
        )
        const total = await db.instance.poi.count(
          filter.where || 'TRUE',
          filter.values
        )
        response.send({
          result: poi,
          paging: { page, total }
        })
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })

  fastify.route({
    method: 'GET',
    url: '/poi/:id/events',
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            events: {
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
        const poi = await db.instance.poi
          .join({ events: { type: 'LEFT', on: { poi_id: 'id' } } })
          .find({ id: request.params.id })
        if (poi.length < 1) {
          response
            .status(404)
            .send({ statusCode: 404, error: 'POI_NOT_FOUND' })
          return
        }
        const poi0 = poi[0]
        poi0.events = poi0.events.map(event => ({
          id: event.id,
          date: moment(event.date).format('YYYY-MM-DD'),
          title: event.title,
          description: event.description
        }))
        response.send(poi0)
      } catch (error) {
        service.handler.error(fastify, request, response, error)
      }
    }
  })
}

module.exports = poi
