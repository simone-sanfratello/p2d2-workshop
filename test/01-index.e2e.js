'use strict'

const { request } = require('./helper')

describe('index service', () => {
  test('should get index by GET /', async () => {
    const response = await request({ path: '/', responseType: 'text' })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.body).toMatch(/Prague/)
  })

  test('should get "not found" error requesting an unknown url - GET /unknown', async () => {
    const response = await request({ path: '/unknown', responseType: 'text' })

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body).toMatch(/not found/)
  })
})
