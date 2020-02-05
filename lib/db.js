'use strict'

const massive = require('massive')
const monitor = require('pg-monitor')

const db = {
  connect: async function (settings) {
    db.instance = await massive({
      host: settings.host,
      port: settings.port,
      database: settings.database,
      user: settings.user,
      password: settings.password,
      poolSize: settings.pool || 10
    })
  },
  disconnect: async function () {
    db.instance.instance.$pool.end()
  },
  monitor: function () {
    monitor.attach(db.instance.driverConfig, ['query', 'error'])
  }
}

module.exports = db
