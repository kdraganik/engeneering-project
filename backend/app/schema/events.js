module.exports.eventInfo = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    place: { type: 'string' },
    date: { type: 'string' }
  }
}
module.exports.eventBody = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    place: { type: 'string' },
    date: { type: 'string' }
  }
}

const { teamObject } = require('./teams')
const { taskInfo } = require('./tasks')
const { noteInfo } = require('./notes')

module.exports.eventObject = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    place: { type: 'string' },
    date: { type: 'string' },
    Teams: { type: 'array', items: teamObject },
    Tasks: { type: 'array', items: taskInfo },
    Notes: { type: 'array', items: noteInfo }
  }
};