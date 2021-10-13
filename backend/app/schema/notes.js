module.exports = {
  noteInfo: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      content: { type: 'string' },
    }
  },
  noteBody: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      EventId: { type: 'integer' }
    }
  },
  noteObject: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      content: { type: 'string' },
      Event: { type: 'array', items: { type: 'object' } }
    }
  },
}