module.exports = {
  noteBody: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      EventId: { type: 'integer' }
    }
  },
  noteInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      content: { type: 'string' },
      EventId: { type: 'integer' }
    }
  }
}