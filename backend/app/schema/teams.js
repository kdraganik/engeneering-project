module.exports = {
  teamBody: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    }
  },
  teamInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' }
    }
  },
  teamObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      Users: { 
        type: 'array', 
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          }
        } 
      },
      Events: { 
        type: 'array', 
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          }
        } 
      },
      Tasks: { 
        type: 'array', 
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          }
        } 
      }
    }
  },
}