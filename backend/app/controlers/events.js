module.exports = function (fastify){
  const getEvent = async (request, reply) => {
    const {id} = request.params;
    const event = await fastify.db.models.Event.findOne({
        attributes: ['id', 'name', 'place', 'date'],
        where: {
          id
        },
        include: [
          {
            model: fastify.db.models.Note
          },
          {
            model: fastify.db.models.Task,
            include: [
              {
                model: fastify.db.models.User
              },
              {
                model: fastify.db.models.Team
              }
            ]
          },
          {
            model: fastify.db.models.Team,
            include: [
              {
                model: fastify.db.models.User
              }
            ]
          }
        ]
    });

    if(event){
      reply.send(event);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No event with given id"
      })
    }
  };

  const getEvents = async (request, reply) => {
    const events = await fastify.db.models.Event.findAll({
      attributes: ['id', 'name', 'place', 'date'],
      include: [
        {
          model: fastify.db.models.Note
        },
        {
          model: fastify.db.models.Task,
          include: [
            {
              model: fastify.db.models.User
            },
            {
              model: fastify.db.models.Team
            }
          ]
        },
        {
          model: fastify.db.models.Team,
          include: [
            {
              model: fastify.db.models.User
            }
          ]
        }
      ]
    });
    
    reply.send(events);
  };

  const createEvent = async (request, reply) => {
    const { name, place, date } = request.body;
    
    const nameEvent = await fastify.db.models.Event.findOne({
      where:{
        name
      }
    });
    
    if(!nameEvent){
      const newEvent = await fastify.db.models.Event.create({
        name,
        place,
        date
      })

      reply.status(201).send(newEvent);
    }
    else{
      reply.status(409).send({
        "statusCode": 409,
        "error": "Conflict",
        "message": "Given name is already in use"
      })
    }
  };

  const editEvent = async (request, reply) => {
    const {id} = request.params;
    const event = await fastify.db.models.Event.findOne({
        where: {
          id
        }
    });

    if(event){
      const {name, place, date} = request.body;

      const nameEvent = await fastify.db.models.Event.findOne({
        where:{
          name
        }
      })

      if(!nameEvent || nameEvent.id == event.id){
        event.name = name || event.name;
        event.place = place || event.place;
        event.date = date || event.date;
        await event.save();

        reply.send(event);
      }
      else{
        reply.status(409).send({
          "statusCode": 409,
          "error": "Conflict",
          "message": "Given name is already in use"
        })
      }
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No event with given id"
      })
    }
  };

  const addTeam = async (request, reply) => {
    const EventId = request.params.id;
    const event = await fastify.db.models.Event.findOne({
        where: {
          id: EventId
        }
    });

    if(event){
      const { TeamId } = request.body;

      const team = await fastify.db.models.Team.findOne({
        where: {
          id: TeamId
        }
      });

      if(team){
        await event.addTeam(team);
        
        reply.send({
          statusCode: 200,
          message: `Team (id: ${TeamId}) added to Event (id: ${EventId})`
        })
      }
      else{
        reply.status(404).send({
          "statusCode": 404,
          "error": "Not found",
          "message": "No team with given id"
        })
      }      
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No event with given id"
      })
    }
  };

  const removeTeam = async (request, reply) => {
    const EventId = request.params.id;
    const event = await fastify.db.models.Event.findOne({
        where: {
          id: EventId
        }
    });

    if(event){
      const { TeamId } = request.body;

      const team = await fastify.db.models.Team.findOne({
        where: {
          id: TeamId
        }
      });

      if(team){
        await event.removeTeam(team);
        
        reply.send({
          statusCode: 200,
          message: `Team (id: ${TeamId}) removed from Event (id: ${EventId})`
        })
      }
      else{
        reply.status(404).send({
          "statusCode": 404,
          "error": "Not found",
          "message": "No team with given id"
        })
      }      
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No event with given id"
      })
    }
  };

  const deleteEvent = async (request, reply) => {
    const {id} = request.params;
    const event = await fastify.db.models.Event.findOne({
        where: {
          id
        }
    });

    if(event){
      await event.destroy();

      reply.send({
          statusCode: 200,
          message: `Event (id: ${id}) removed successfully`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No event with given id"
      })
    }
  };

  return { 
    getEvent, 
    getEvents, 
    createEvent, 
    editEvent,
    addTeam,
    removeTeam,
    deleteEvent 
  };
}