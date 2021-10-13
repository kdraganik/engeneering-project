module.exports = function (fastify, opts, done) {
  
  const { login, getUser, getUsers, createUser, editUser, deleteUser } = require("../controlers/users")(fastify);

  const { confirmation } = require('../schema');
  const { userInfo, userObject, userBody } = require('../schema/users');

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
    handler: getUser,
    schema:{
      response:{
        200: userObject
      }
    }
  };

  const getUsersOpts = {
    handler: getUsers,
    schema:{
      response:{
        200: {
          type: 'array',
          items: userObject
        }
      }
    }
  };

  const createUserOpts = {
    handler: createUser,
    schema: {
      body: userBody,
      response:{
        201: userInfo
      }
    }
  };

  const editUserOpts = {
    handler: editUser,
    schema: {
      body: userBody,
      response: {
        200: userInfo
      }
    }
  }
  
  const deleteUserOpts = {
    handler: deleteUser,
    schema: {
      response: {
        200: confirmation
      }
    }
  } 

  fastify.post('/login', loginOpts)

  fastify.get('/users', getUsersOpts)

  fastify.get('/users/:id',  getUserOpts)

  fastify.post('/users/create', createUserOpts)

  fastify.put('/users/:id/edit', editUserOpts)

  fastify.delete('/users/:id/delete', deleteUserOpts)

  done()
}