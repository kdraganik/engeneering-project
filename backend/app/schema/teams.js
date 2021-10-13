module.exports = {
  teamInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' }
    }
  },
  teamBody: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  },
  teamObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      Users: { type: 'array', items: { type: 'object' } },
      Events: { type: 'array', items: { type: 'object' } }
    }
  },
}