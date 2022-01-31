module.exports = {
  taskBody:{
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      status: { type: 'string' },
      date: { type: 'string' },
      priority: { type: 'string' },
      TaskId: { type: 'integer' },
      TeamId: { type: 'integer' },
      EventId: { type: 'integer' }
    }
  },
  taskInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      description: { type: 'string' },
      status: { type: 'string' },
      date: { type: 'string' },
      priority: { type: 'string' },
      TaskId: { type: 'integer' },
      EventId: { type: 'integer'},
      TeamId: { type: 'integer' },
    }
  },
  taskObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      description: { type: 'string' },
      status: { type: 'string' },
      date: { type: 'string' },
      priority: { type: 'string' },
      TaskId: { type: 'integer' },
      EventId: { type: 'integer'},
      TeamId: { type: 'integer' },
      Users: { 
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
      Comments: { 
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