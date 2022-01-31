module.exports = {
  userBody: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string' },
      password: { type: 'string' }
    }
  },
  userInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string' }
    }
  },
  userObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string' },
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
      }
    }
  }
}