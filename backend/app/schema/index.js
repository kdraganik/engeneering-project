module.exports = {
  confirmation: {
    type: 'object',
    properties: {
        statusCode: { type: 'integer' },
        message: { type: 'string' }
    }
  },
  headers: {
    type: 'object',
    properties: {
      'Authorization': { type: 'string' }
    },
    required: ['Authorization']
  }
}