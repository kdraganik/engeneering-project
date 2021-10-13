module.exports = function (fastify, opts, done) {

  const { getTeam, getTeams, createTeam, editTeam, addUser, removeUser, deleteTeam } = require('../controlers/teams')(fastify);
  const { confirmation } = require('../schema');
  const { teamInfo, teamBody, teamObject } = require('../schema/teams');

  const getTeamOpts = {
    handler: getTeam,
    schema:{
      response:{
        200: teamObject
      }
    }
  };

  const getTeamsOpts = {
    handler: getTeams,
    schema:{
      response:{
        200: {
          type: 'array',
          items: teamObject
        }
      }
    }
  };

  const createTeamOpts = {
    handler: createTeam,
    schema: {
      body: teamBody,
      response:{
        201: teamInfo
      }
    }
  };

  const editTeamOpts = {
    handler: editTeam,
    schema: {
      body: teamBody,
      response: {
        200: teamInfo
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
  
  const deleteTeamOpts = {
    handler: deleteTeam,
    schema: {
      response: {
        200: confirmation
      }
    }
  } 

  fastify.get('/teams',  getTeamsOpts)

  fastify.get('/teams/:id', getTeamOpts)

  fastify.post('/teams/create', createTeamOpts)

  fastify.put('/teams/:id/edit', editTeamOpts)

  fastify.put('/teams/:id/addUser', addUserOpts)

  fastify.put('/teams/:id/removeUser', removeUserOpts)

  fastify.delete('/teams/:id/delete', deleteTeamOpts)

  done()
}