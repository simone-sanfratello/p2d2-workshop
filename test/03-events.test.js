'use strict'

const helper = require('./helper')

let data

beforeAll(async () => {
  data = await helper.db.setup()
})

afterAll(async () => {
  await helper.db.teardown(data)
})

describe('GET /events', () => {
  test('should get the list of events by correct request', async () => {
    const response = await helper.request({
      path: '/events'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('should get the list of events filtered by date', async () => {
    const response = await helper.request({
      path: '/events?date=2001-01-01'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body
      .every(event => event.date.includes('2001-01-01')))
      .toBe(true)
  })

  test('should get error due to invalid date request', async () => {
    const response = await helper.request({
      path: '/events?date=not-a-date'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
  })
})
