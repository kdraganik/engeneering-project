module.exports = {
  eventBody: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      place: { type: 'string' },
      date: { type: 'string' }
    }
  },
  eventInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      place: { type: 'string' },
      date: { type: 'string' }
    }
  },
  eventObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      place: { type: 'string' },
      date: { type: 'string' },
      Teams: { 
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
      },
      Notes: { 
        type: 'array', 
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' }
          }
        } 
      },
    }
  }
}