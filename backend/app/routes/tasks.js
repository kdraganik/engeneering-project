module.exports = function (fastify, opts, done) {

  const { getTask, getTasks, createTask, editTask, deleteTask, addUser, removeUser } = require('../controlers/tasks')(fastify);
  const { headers, confirmation } = require('../schema');
  const { taskInfo, taskBody, taskObject } = require('../schema/tasks');

  const getTaskOpts = {
    preHandler: fastify.auth,
    handler: getTask,
    schema:{
      headers,
      response:{
        200: taskObject
      }
    }
  };

  const getTasksOpts = {
    preHandler: fastify.auth,
    handler: getTasks,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: taskObject
        }
      }
    }
  };

  const createTaskOpts = {
    preHandler: fastify.auth,
    handler: createTask,
    schema: {
      headers,
      body: taskBody,
      response:{
        201: taskInfo
      }
    }
  };

  const editTaskOpts = {
    preHandler: fastify.auth,
    handler: editTask,
    schema: {
      headers,
      body: taskBody,
      response: {
        200: taskInfo
      }
    }
  }
  
  const deleteTaskOpts = {
    preHandler: fastify.auth,
    handler: deleteTask,
    schema: {
      headers,
      response: {
        200: confirmation
      }
    }
  }

  const addUserOpts ={
    preHandler: fastify.auth,
    handler: addUser,
    schema: {
      headers,
      body: {
        type: 'object',
        properties: {
          UserId: { type: 'integer' }
        }
      },
      response: {
        200: confirmation
      }
    }
  }

  const removeUserOpts ={
    preHandler: fastify.auth,
    handler: removeUser,
    schema: {
      headers,
      body: {
        type: 'object',
        properties: {
          UserId: { type: 'integer' }
        }
      },
      response: {
        200: confirmation
      }
    }
  }

  fastify.get('/tasks/:id', getTaskOpts)
  
  fastify.get('/tasks', getTasksOpts)

  fastify.post('/tasks/create', createTaskOpts)

  fastify.put('/tasks/:id/edit', editTaskOpts)

  fastify.delete('/tasks/:id/delete', deleteTaskOpts)

  fastify.put('/tasks/:id/addUser', addUserOpts)

  fastify.put('/tasks/:id/removeUser', removeUserOpts)

  done()
}