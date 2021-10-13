module.exports.taskBody = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    status: { type: 'string' },
    date: { type: 'string' },
    priority: { type: 'string' },
    TaskId: { type: 'integer' },
    TeamId: { type: 'integer' },
    EventId: { type: 'integer' }
  }
};

module.exports.taskObject = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    status: { type: 'string' },
    date: { type: 'string' },
    priority: { type: 'string' },
    TaskId: { type: 'integer' },
    EventId: { type: 'integer'},
    TeamId: { type: 'integer' },
    Users: { type: 'array', items: { type: 'object' } },
    Tasks: { type: 'array', items: { type: 'object' } },
    Comments: { type: 'array', items: { type: 'object' } }
  }
};

const { userInfo } = require('./users');

module.exports.taskInfo = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    status: { type: 'string' },
    date: { type: 'string' },
    priority: { type: 'string' },
    Users: { type: 'array', items: userInfo }
  }
};