const { teamObject } = require("../schema/teams");

module.exports = function(fastify){
  const getTask = async (request, reply) => {
    const {id} = request.params;
    const task = await fastify.db.models.Task.findOne({
        attributes: ['name', 'status', 'date', 'priority', 'TaskId', 'EventId', 'TeamId'],
        where: {
          id
        },
        include: [
          {
            model: fastify.db.models.Task,
            attributes: ['id', 'name', 'status', 'date', 'priority']
          },
          {
            model: fastify.db.models.Comment,
            attributes: ['id', 'content', 'date'],
            include: [
              {
                model: fastify.db.models.User,
                attributes: ['id', 'firstName', 'lastName']
              }
            ],
          }
        ],
        order: [
          [
            {model: fastify.db.models.Comment}, 
            'date'
          ]
        ],
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
      attributes: ['name', 'date', 'priority', 'TaskId', 'TeamId', 'EventId'],
      include: [
        {
          model: fastify.db.models.Task
        },
        {
          model: fastify.db.models.Comment
        },
        {
          model: fastify.db.models.User
        }
      ]
    });
    
    reply.send(tasks);
  };

  const createTask = async (request, reply) => {
    const { name, date, priority, EventId, TeamId, TaskId } = request.body;
    
    const newTask = await fastify.db.models.Task.create({
      name,
      date,
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
      const { name, status, date, priority, isSubtask, TaskId, TeamId} = request.body;

      task.name = name || task.name;
      task.status = status || task.status;
      task.date = date || task.date;
      task.priority = priority || task.priority;
      task.isSubtask = isSubtask || task.isSubtask;
      task.TaskId = TaskId || task.TaskId;
      task.TeamId = TeamId || task.TeamId;
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
  }

  return { 
    getTask, 
    getTasks, 
    createTask, 
    editTask,
    addUser,
    removeUser,
    deleteTask 
  }
}