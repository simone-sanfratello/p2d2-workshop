'use strict'

const { request } = require('./helper')

describe('documentation plugin', () => {
  test('should get documentation entry page requesting documentation url', async () => {
    const response = await request({ path: '/documentation/static/index.html', responseType: 'text' })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('text/html')
    expect(response.body).toMatch(/swagger/i)
  })
})
