'use strict'

const fastify = require('fastify')

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
  let _fastify
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
      _fastify = fastify({
        ...settings.fastify,
        logger: log
      })
      _defaults()
      const apply = await _plugins()
      await _services()
      await _fastify.ready()
      apply()
      await _fastify.listen(settings.server)
      log.info('\n', _fastify.printRoutes())
    } catch (error) {
      log.error('error on server.start')
      log.error(error)
      throw error
    }
  }

  /**
   * use a middleware to set default response
   */
  const _defaults = function () {
    _fastify.use('*', (request, response) => {
      response
        .status(200)
        .type('application/json; charset=utf-8')
    })
  }

  /**
   * load services into fastify
   * @async
   * @throws errors if operation fails for some reasons, i.e. path not accessible
   */
  const _services = async function () {
    log.trace('server.services', settings.services)
    for (const service of settings.services) {
      log.trace('load service', service)
      require(service)(_fastify)
    }
  }

  /**
   * apply plugins to fastify
   * @async
   * @return {function()} function to be applied when fastify is ready
   * @throws errors if operation fails for some reasons, i.e. path not accessible
   */
  const _plugins = async function () {
    log.trace('server.plugins', settings.plugins)
    const apply = []
    for (const plugin of settings.plugins) {
      log.trace('load plugin', plugin)
      apply.push(require(plugin)(_fastify))
    }
    return () => apply.forEach(f => f && f())
  }

  /**
   * stop the web server
   * @async
   * @throws errors if operation fails for some reasons, i.e. server not started
   */
  const stop = async function () {
    log.trace('server.stop')
    try {
      await _fastify.close()
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
