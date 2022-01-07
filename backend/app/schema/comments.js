module.exports = {
  commentBody: {
    type: 'object',
    properties: {
      content: { type: 'string' },
      TaskId: { type: 'integer' },
      UserId: { type: 'integer' }
    }
  },
  commentInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      content: { type: 'string' },
      date: { type: 'string' },
      TaskId: { type: 'integer' },
      UserId: { type: 'integer' }
    }
  }
}