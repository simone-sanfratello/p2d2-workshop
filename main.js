'use strict'

const settings = require('./settings')
const server = require('./lib/server')
const db = require('./lib/db')
const logger = require('pino')(settings.log)

async function main () {
  try {
    logger.info('app starting', { env: settings.env })
    await db.connect(settings.postgresql)
    await server({ ...settings, logger }).start()
    if (settings.monitor.sql) {
      db.monitor()
    }
  } catch (error) {
    logger.error('error on app starting')
    logger.error(error)
  }
}

main()
