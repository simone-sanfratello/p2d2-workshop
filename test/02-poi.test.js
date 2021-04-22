'use strict'

const helper = require('./helper')

let data

beforeAll(async () => {
  data = await helper.db.setup()
})

afterAll(async () => {
  await helper.db.teardown(data)
})

describe('GET /poi/:id', () => {
  test('should get the poi by correct request', async () => {
    const response = await helper.request({
      path: `/poi/${data.poi[0].id}`
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body).toEqual(data.poi[0])
  })

  test('should get error due to invalid id', async () => {
    const response = await helper.request({
      path: '/poi/not-an-id'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })

  test('should get error due to not existing poi', async () => {
    const response = await helper.request({
      path: '/poi/9999'
    })

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('POI_NOT_FOUND')
  })
})

describe('POST /poi', () => {
  test('should successfully create new poi by correct request', async () => {
    const response = await helper.request({
      path: '/poi',
      method: 'POST',
      json: { name: '#test - create' }
    })

    expect(response.statusCode).toBe(201)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.name).toEqual('#test - create')
    data.poi.push({ id: response.body.id })
  })

  test('should get error attempting to create poi without name', async () => {
    const response = await helper.request({
      path: '/poi',
      method: 'POST'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })
})

describe('PATCH /poi/:id', () => {
  test('should successfully update the poi by correct request', async () => {
    const response = await helper.request({
      path: `/poi/${data.poi[1].id}`,
      method: 'PATCH',
      json: { name: '#test - update' }
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.name).toEqual('#test - update')
  })

  test('should get error trying to update a poi without name', async () => {
    const response = await helper.request({
      path: `/poi/${data.poi[1].id}`,
      method: 'PATCH'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })

  test('should get error trying to update a poi by invalid id', async () => {
    const response = await helper.request({
      path: '/poi/not-an-id',
      method: 'PATCH',
      json: { name: '#test - update' }
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })
})

describe('DELETE /poi', () => {
  test('should successfully delete the poi by correct request', async () => {
    const response = await helper.request({
      path: `/poi/${data.poi[2].id}`,
      method: 'DELETE'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.id).toBe(data.poi[2].id)
  })

  test('should successfully delete non existing poi', async () => {
    const response = await helper.request({
      path: '/poi/999',
      method: 'DELETE'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.id).toBe(999)
  })

  test('should get error trying to delete a poi by invalid id', async () => {
    const response = await helper.request({
      path: '/poi/not-an-id',
      method: 'DELETE'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })
})

describe('GET /poi', () => {
  test('should get the list of poi by correct request', async () => {
    const response = await helper.request({
      path: '/poi'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.result.length).toBeGreaterThan(0)
  })

  // filter

  test('should get the list of poi filtered by name', async () => {
    const response = await helper.request({
      path: '/poi?name=test'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.result
      .every(poi => poi.name.toLowerCase().includes('test')))
      .toBe(true)
  })

  // paging

  test('should get the list of poi paged', async () => {
    const response = await helper.request({
      path: '/poi?page=2&size=5'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.result.length).toBe(5)
    expect(response.body.paging.page).toBe(2)
    expect(response.body.paging.total).toBeGreaterThanOrEqual(2 * 5)
  })

  test('should get error due to invalid page request', async () => {
    const response = await helper.request({
      path: '/poi?page=0'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
  })

  // sort

  test('should get the list of poi sorted', async () => {
    const response = await helper.request({
      path: '/poi?sort[]=name:asc'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
  })

  test('should get the list of poi sorted - syntax variant', async () => {
    const response = await helper.request({
      path: '/poi?sort=name:asc'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
  })

  test('should get error due to invalid sorting field request', async () => {
    const response = await helper.request({
      path: '/poi?sort[]=id:asc'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
  })

  // full options

  test('should get the list of poi filtered, paged and sorted', async () => {
    const response = await helper.request({
      path: '/poi?name=test%20poi&sort[]=name:desc&page=2&size=3'
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.result
      .every(poi => poi.name.toLowerCase().includes('test poi')))
      .toBe(true)
    expect(response.body.result.length).toBe(3)
    expect(response.body.paging.page).toBe(2)
    expect(response.body.paging.total).toBeGreaterThanOrEqual(2 * 3)
  })
})

describe('GET /poi/:id/events', () => {
  test('should get the poi events by correct request', async () => {
    const response = await helper.request({
      path: `/poi/${data.poi[0].id}/events`
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.events[0].id).toEqual(data.events[0].id)
  })

  test('should get error due to invalid id', async () => {
    const response = await helper.request({
      path: '/poi/not-an-id/events'
    })

    expect(response.statusCode).toBe(400)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('Bad Request')
  })

  test('should get error due to not existing poi', async () => {
    const response = await helper.request({
      path: '/poi/9999/events'
    })

    expect(response.statusCode).toBe(404)
    expect(response.headers['content-type']).toContain('application/json')
    expect(response.body.error).toBe('POI_NOT_FOUND')
  })
})
