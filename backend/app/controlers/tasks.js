const { teamObject } = require("../schema/teams");

module.exports = function(fastify){
  const getTask = async (request, reply) => {
    const {id} = request.params;
    const task = await fastify.db.models.Task.findOne({
      where: {
        id
      },
      attributes: ['id', 'name', 'description', 'status', 'date', 'priority', 'TaskId', 'EventId', 'TeamId'],
      include: [
        {
          model: fastify.db.models.Task,
          attributes: ['id']
        },
        {
          model: fastify.db.models.Comment,
          attributes: ['id']
        },
        {
          model: fastify.db.models.User,
          attributes: ['id']
        },
      ]
    });

    if(task){
      reply.send(task);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No task with given id"
      })
    }
  };

  const getTasks = async (request, reply) => {
    const tasks = await fastify.db.models.Task.findAll({
      attributes: ['id', 'name', 'description', 'status', 'date', 'priority', 'TaskId', 'EventId', 'TeamId'],
      include: [
        {
          model: fastify.db.models.Task,
          attributes: ['id']
        },
        {
          model: fastify.db.models.Comment,
          attributes: ['id']
        },
        {
          model: fastify.db.models.User,
          attributes: ['id']
        },
      ]
    });
    
    reply.send(tasks);
  };

  const createTask = async (request, reply) => {
    const { name, date, description, priority, EventId, TeamId, TaskId } = request.body;
    
    const newTask = await fastify.db.models.Task.create({
      name,
      date,
      description,
      priority,
      EventId,
      TeamId,
      ...(TaskId != null && { TaskId })
    })

    reply.status(201).send(newTask);
  };

  const editTask = async (request, reply) => {
    const {id} = request.params;
    const task = await fastify.db.models.Task.findOne({
        where: {
          id
        }
    })

    if(task){
      const { name, status, description, date, priority, TaskId, TeamId} = request.body;

      task.name = name || task.name;
      task.description = description || task.description;
      task.status = status || task.status;
      task.date = date || task.date;
      task.priority = priority || task.priority;
      task.TaskId = TaskId || task.TaskId;
      task.TeamId = TeamId === 0 ? null : TeamId || task.TeamId;
      await task.save();

      reply.send(task);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No task with given id"
      })
    }
  };

  const deleteTask = async (request, reply) => {
    const {id} = request.params;
    const task = await fastify.db.models.Task.findOne({
        where: {
          id
        }
    });

    if(task){
      await task.destroy();

      reply.send({
          statusCode: 200,
          message: `Task with id: ${id} removed successfully`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No task with given id"
      })
    }
  };

  const addUser = async (request, reply) => {
    const TaskId = request.params.id;
    const task = await fastify.db.models.Task.findOne({
        where: {
          id: TaskId
        }
    });

    if(task){
      const { UserId } = request.body;

      const user = await fastify.db.models.User.findOne({
        where: {
          id: UserId
        }
      });

      if(user){
        await task.addUser(user);
        
        reply.send({
          statusCode: 200,
          message: `User (id: ${UserId}) successfully added to Task (id: ${TaskId})`
        })
      }
      else{
        reply.status(404).send({
          "statusCode": 404,
          "error": "Not found",
          "message": "No user with given id"
        })
      }      
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No task with given id"
      })
    }
  };

  const removeUser = async (request, reply) => {
    const TaskId = request.params.id;
    const task = await fastify.db.models.Task.findOne({
        where: {
          id: TaskId
        }
    });

    if(task){
      const { UserId } = request.body;

      const user = await fastify.db.models.User.findOne({
        where: {
          id: UserId
        }
      });

      if(user){
        await task.removeUser(user);
        
        reply.send({
          statusCode: 200,
          message: `User (id: ${UserId}) successfully removed from Task (id: ${TaskId})`
        })
      }
      else{
        reply.status(404).send({
          "statusCode": 404,
          "error": "Not found",
          "message": "No user with given id"
        })
      }      
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No task with given id"
      })
    }
  };

  return { 
    getTask, 
    getTasks, 
    createTask, 
    editTask,
    deleteTask,
    addUser,
    removeUser 
  }
}