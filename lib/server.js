'use strict'

const path = require('path')
const fastify = require('fastify')
const autoload = require('fastify-autoload')

/**
 * The web server
 * @typedef {Object} Server
 * @property {function()} start - start the web server
 * @property {function()} stop - stop the web server
 */

/**
 * instantiate the server
 * @param {Settings} settings - server settings
 * @param {Logger?} settings.logger - logger instance
 * @return {Server} server instance
 * @throws errors if settings are not valid
 */
const server = function (settings) {
  let app
  const log = settings.logger

  /**
   * start the web server
   * @async
   * @throws errors if operation fails for some reasons
   * - port not available
   * - error loading plugins
   * - error loading services
   */
  const start = async function () {
    log.trace('server.start')
    try {
      app = fastify({
        ...settings.fastify,
        logger: log
      })

      app.register(autoload, {
        dir: path.join(__dirname, '../services'),
        dirNameRoutePrefix: false
      })

      app.register(autoload, {
        dir: path.join(__dirname, '../plugins'),
        dirNameRoutePrefix: false
      })

      await app.listen(settings.server)
    } catch (error) {
      log.error('error on server.start')
      log.error(error)
      throw error
    }
  }

  /**
   * stop the web server
   * @async
   * @throws errors if operation fails for some reasons, i.e. server not started
   */
  const stop = async function () {
    log.trace('server.stop')
    try {
      await app.close()
    } catch (error) {
      log.error('error on server.stop')
      log.error(error)
    }
  }

  return {
    start,
    stop
  }
}

module.exports = server
