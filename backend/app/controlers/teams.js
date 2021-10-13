module.exports = function (fastify){
  const getTeam = async (request, reply) => {
    const {id} = request.params;
    const team = await fastify.db.models.Team.findOne({
      where: {
        id
      },
      attributes: ['id', 'name'],
      include: [
        {
          model: fastify.db.models.User,
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: fastify.db.models.Event,
          attributes: ['id', 'name', 'date', 'place'],
          include: [
            {
              model: fastify.db.models.Task,
              attributes: ['id', 'name', 'date', 'priority', 'status'],
              where: {
                TeamId: id
              }
            }
          ]
        }
      ]
    });

    if(team){
      reply.send(team);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No team with given id"
      })
    }
  };

  const getTeams = async (request, reply) => {
    const teams = await fastify.db.models.Team.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: fastify.db.models.User,
          attributes: ['id', 'firstName', 'lastName', 'role']
        },
        {
          model: fastify.db.models.Event,
          attributes: ['id', 'name', 'date', 'place']
        }
      ]
    });
    
    reply.send(teams);
  };

  const createTeam = async (request, reply) => {
    const { name } = request.body;
    
    const nameTeam = await fastify.db.models.Team.findOne({
      where:{
        name
      }
    });
    
    if(!nameTeam){
      const newTeam = await fastify.db.models.Team.create({
        name
      })

      reply.status(201).send(newTeam);
    }
    else{
      reply.status(409).send({
        "statusCode": 409,
        "error": "Conflict",
        "message": "Given name is already in use"
      })
    }
  };

  const editTeam = async (request, reply) => {
    const {id} = request.params;
    const team = await fastify.db.models.Team.findOne({
        where: {
          id
        }
    });

    if(team){
      const {name} = request.body;

      const nameTeam = await fastify.db.models.Team.findOne({
        where:{
          name
        }
      })

      if(!nameTeam || nameTeam.id == team.id){
        team.name = name;
        await team.save();

        reply.send(team);
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
        "message": "No team with given id"
      })
    }
  };

  const addUser = async (request, reply) => {
    const TeamId = request.params.id;
    const team = await fastify.db.models.Team.findOne({
        where: {
          id: TeamId
        }
    });

    if(team){
      const { UserId } = request.body;

      const user = await fastify.db.models.User.findOne({
        where: {
          id: UserId
        }
      });

      if(user){
        await team.addUser(user);
        
        reply.send({
          statusCode: 200,
          message: `User (id: ${UserId}) successfully added to Team (id: ${TeamId})`
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
        "message": "No team with given id"
      })
    }
  };

  const removeUser = async (request, reply) => {
    const TeamId = request.params.id;
    const team = await fastify.db.models.Team.findOne({
        where: {
          id: TeamId
        }
    });

    if(team){
      const { UserId } = request.body;

      const user = await fastify.db.models.User.findOne({
        where: {
          id: UserId
        }
      });

      if(user){
        await team.removeUser(user);
        
        reply.send({
          statusCode: 200,
          message: `User (id: ${UserId}) successfully removed from Team (id: ${TeamId})`
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
        "message": "No team with given id"
      })
    }
  };

  const deleteTeam = async (request, reply) => {
    const {id} = request.params;
    const team = await fastify.db.models.Team.findOne({
        where: {
          id
        }
    });

    if(team){
      await team.destroy();

      reply.send({
          statusCode: 200,
          message: `Team (id: ${id}) successfully deleted`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No team with given id"
      })
    }
  };

  return {
    getTeam,
    getTeams,
    createTeam,
    editTeam,
    addUser,
    removeUser,
    deleteTeam
  }
}