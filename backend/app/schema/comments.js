module.exports = {
  commentInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      content: { type: 'string' },
      date: { type: 'string' }
    }
  },
  commentBody: {
    type: 'object',
    properties: {
      content: { type: 'string' },
      TaskId: { type: 'integer' },
      UserId: { type: 'integer' }
    }
  },
  commentObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      content: { type: 'string' },
      date: { type: 'string' },
      Task: { type: 'object' },
      User: { type: 'object' }
    }
  },
}