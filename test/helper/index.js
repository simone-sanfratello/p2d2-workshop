'use strict'

const got = require('got')
const options = { retry: 0, responseType: 'json', throwHttpErrors: false }
const settings = require('../../settings')
const db = require('../../lib/db')
const server = require('../../lib/server')
const logger = require('pino')(settings.log)

let _server

const helper = {
  db: {
    setup: async function () {
      await db.connect(settings.postgresql)
      // db.monitor()
      const poi = await db.instance.poi.insert([
        { name: 'Test POI #1' },
        { name: 'Test POI #2' },
        { name: 'Test POI #3' },
        { name: 'Test POI #4' },
        { name: 'Test POI #5' },
        { name: 'Test POI #6' },
        { name: 'Test POI #7' },
        { name: 'Test POI #8' },
        { name: 'Test POI #9' }
      ])

      const events = await db.instance.events.insert([
        { poi_id: poi[0].id, date: '2001-01-01', title: 'Test Event #1', description: 'Test event ...' },
        { poi_id: poi[0].id, date: '2002-01-01', title: 'Test Event #2', description: 'Test event ...' },
        { poi_id: poi[0].id, date: '2003-01-01', title: 'Test Event #3', description: 'Test event ...' }
      ])

      // console.log('data setup done', poi)
      return { poi, events }
    },
    teardown: async function (data) {
      const events = await Promise.all(data.events.map(event => {
        return db.instance.events.destroy(event.id)
      }))
      const poi = await Promise.all(data.poi.map(poi => {
        return db.instance.poi.destroy(poi.id)
      }))

      // console.log('data teardown done', poi)
      await db.disconnect()
      return { poi, events }
    }
  },
  server: {
    setup: async function () {
      await db.connect(settings.postgresql)
      db.monitor()
      _server = server({ ...settings, logger })
      await _server.start()
    },
    teardown: async function () {
      await db.disconnect()
      await _server.stop()
    }
  },
  request: async function (request) {
    return got({ prefixUrl: `http://127.0.0.1:${settings.server.port}/`, ...options, ...request })
  }
}

module.exports = helper
