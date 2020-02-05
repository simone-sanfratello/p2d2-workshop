'use strict'

const handler = {
  error: function (fastify, request, response, error) {
    fastify.log.error({
      request: request.id,
      method: request.raw.method,
      url: request.raw.originalUrl,
      ip: request.ip,
      params: request.params,
      query: request.query,
      body: request.body,
      headers: request.headers
    })
    fastify.log.error(error)
    response
      .status(500)
      .send({ statusCode: 500, error: 'APPLICATION_ERROR' })
  }
}

module.exports = handler
