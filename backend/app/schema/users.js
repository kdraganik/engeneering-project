module.exports.userInfo = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    role: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' }
  }
};

module.exports.userBody = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    role: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
    password: { type: 'string' }
  }
};

const { teamInfo } = require('./teams');
const { eventObject } = require('./events');

module.exports.userObject = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    role: { type: 'string' },
    email: { type: 'string' },
    phoneNumber: { type: 'string' },
    Teams: { type: 'array', items: teamInfo },
    Events: { type: 'array', items: eventObject }
  }
};