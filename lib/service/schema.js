'use strict'

const schema = {
  400: {
    description: 'Bad request response',
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  404: {
    description: 'Resource not found',
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  },
  500: {
    description: 'Server error response',
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  }
}

module.exports = schema
