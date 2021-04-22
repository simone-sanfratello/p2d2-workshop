'use strict'

const path = require('path')
const fs = require('fs-extra')

/**
 * add index service to server
 * @param {Fastify} - fastify instance
 */
const main = async function (fastify) {
  fastify.get('/', async (request, response) => {
    response
      .type('text/html; encoding=utf-8')
      .send(await fs.readFile(path.join(__dirname, '../assets/index.html')))
  })
}

module.exports = main
