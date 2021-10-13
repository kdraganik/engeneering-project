module.exports = function (fastify, opts, done) {

  const { getTask, getTasks, createTask, editTask, addUser, removeUser, deleteTask } = require('../controlers/tasks')(fastify);
  const { confirmation } = require('../schema');
  const { taskInfo, taskBody, taskObject} = require('../schema/tasks');

  const getTaskOpts = {
    handler: getTask,
    schema:{
      response:{
        200: taskObject
      }
    }
  };

  const getTasksOpts = {
    handler: getTasks,
    schema:{
      response:{
        200: {
          type: 'array',
          items: taskObject
        }
      }
    }
  };

  const createTaskOpts = {
    handler: createTask,
    schema: {
      body: taskBody,
      response:{
        201: taskInfo
      }
    }
  };

  const editTaskOpts = {
    handler: editTask,
    schema: {
      body: taskBody,
      response: {
        200: taskInfo
      }
    }
  }

  const addUserOpts ={
    handler: addUser,
    schema: {
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
    handler: removeUser,
    schema: {
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
  
  const deleteTaskOpts = {
    handler: deleteTask,
    schema: {
      response: {
        200: confirmation
      }
    }
  } 

  fastify.get('/tasks/:id', getTaskOpts)
  
  fastify.get('/tasks', getTasksOpts)

  fastify.post('/tasks/create', createTaskOpts)

  fastify.put('/tasks/:id/edit', editTaskOpts)

  fastify.put('/tasks/:id/addUser', addUserOpts)

  fastify.put('/tasks/:id/removeUser', removeUserOpts)

  fastify.delete('/tasks/:id/delete', deleteTaskOpts)

  done()
}