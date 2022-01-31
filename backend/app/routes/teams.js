module.exports = function (fastify, opts, done) {

  const { getTeam, getTeams, createTeam, editTeam, deleteTeam, addUser, removeUser, getTeamUsers } = require('../controlers/teams')(fastify);
  const { headers, confirmation } = require('../schema');
  const { teamInfo, teamBody, teamObject } = require('../schema/teams');
  const { userInfo } = require('../schema/users');

  const getTeamOpts = {
    preHandler: fastify.auth,
    handler: getTeam,
    schema:{
      headers,
      response:{
        200: teamObject
      }
    }
  };

  const getTeamsOpts = {
    preHandler: fastify.auth,
    handler: getTeams,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: teamObject
        }
      }
    }
  };

  const createTeamOpts = {
    preHandler: fastify.auth,
    handler: createTeam,
    schema: {
      headers,
      body: teamBody,
      response:{
        201: teamInfo
      }
    }
  };

  const editTeamOpts = {
    preHandler: fastify.auth,
    handler: editTeam,
    schema: {
      headers,
      body: teamBody,
      response: {
        200: teamInfo
      }
    }
  }
  
  const deleteTeamOpts = {
    preHandler: fastify.auth,
    handler: deleteTeam,
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

  const getTeamUsersOpts = {
    preHandler: fastify.auth,
    handler: getTeamUsers,
    schema: {
      headers,
      response: {
        200: {
          type: 'array',
          items: userInfo
        }
      }
    }
  }

  fastify.get('/teams',  getTeamsOpts)

  fastify.get('/teams/:id', getTeamOpts)

  fastify.post('/teams/create', createTeamOpts)

  fastify.put('/teams/:id/edit', editTeamOpts)

  fastify.delete('/teams/:id/delete', deleteTeamOpts)

  fastify.put('/teams/:id/addUser', addUserOpts)

  fastify.put('/teams/:id/removeUser', removeUserOpts)

  fastify.get('/teams/:id/getUsers', getTeamUsersOpts)

  done()
}