module.exports = function (fastify, opts, done) {
  
  const { login, getUser, getUsers, createUser, editUser, deleteUser, getOverdueTasks, getEvents } = require("../controlers/users")(fastify);

  const { headers, confirmation } = require('../schema');
  const { userInfo, userObject, userBody } = require('../schema/users');
  const { taksInfo } = require('../schema/tasks');
  const { eventObject } = require('../schema/events')

  const loginOpts = {
    handler: login,
    schema:{
      body:{
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      response:{
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            expiryDate: { type: 'string' },
            id: { type: 'integer' },
            role: { type: 'string' }
          }
        }
      }
    }
  }
  
  const getUserOpts = {
    preHandler: fastify.auth,
    handler: getUser,
    schema:{
      headers,
      response:{
        200: userObject
      }
    }
  };

  const getUsersOpts = {
    preHandler: fastify.auth,
    handler: getUsers,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: userObject
        }
      }
    }
  };

  const createUserOpts = {
    preHandler: fastify.auth,
    handler: createUser,
    schema: {
      headers,
      body: userBody,
      response:{
        201: userInfo
      }
    }
  };

  const editUserOpts = {
    preHandler: fastify.auth,
    handler: editUser,
    schema: {
      headers,
      body: userBody,
      response: {
        200: userInfo
      }
    }
  }
  
  const deleteUserOpts = {
    preHandler: fastify.auth,
    handler: deleteUser,
    schema: {
      headers,
      response: {
        200: confirmation
      }
    }
  }

  const getOverdueTasksOpts = {
    preHandler: fastify.auth,
    handler: getOverdueTasks,
    schema: {
      headers,
      response: {
        200: {
          type: 'array',
          items: taksInfo
        }
      }
    }
  }

  const getEventsOpts = {
    preHandler: fastify.auth,
    handler: getEvents,
    schema: {
      headers,
      response: {
        200: {
          type: 'array',
          items: eventObject
        }
      }
    }
  }

  fastify.post('/login', loginOpts)

  fastify.get('/users', getUsersOpts)

  fastify.get('/users/:id', getUserOpts)

  fastify.post('/users/create', createUserOpts)

  fastify.put('/users/:id/edit', editUserOpts)

  fastify.delete('/users/:id/delete', deleteUserOpts)

  fastify.get('/users/:id/overdueTasks', getOverdueTasksOpts)

  fastify.get('/users/:id/getEvents', getEventsOpts)

  done()
}