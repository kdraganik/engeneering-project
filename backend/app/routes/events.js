module.exports = function (fastify, opts, done) {

  const { getEvent, getEvents, createEvent, editEvent, addTeam, removeTeam, deleteEvent } = require('../controlers/events')(fastify);
  const { confirmation } = require('../schema');
  const { eventInfo, eventBody, eventObject } = require('../schema/events');

  const getEventOpts = {
    handler: getEvent,
    schema:{
      response:{
        200: eventObject
      }
    }
  };

  const getEventsOpts = {
    handler: getEvents,
    schema:{
      response:{
        200: {
          type: 'array',
          items: eventObject
        }
      }
    }
  };

  const createEventOpts = {
    handler: createEvent,
    schema: {
      body: eventBody,
      response:{
        201: eventInfo
      }
    }
  };

  const editEventOpts = {
    handler: editEvent,
    schema: {
      body: eventBody,
      response: {
        200: eventInfo
      }
    }
  }

  const addTeamOpts ={
    handler: addTeam,
    schema: {
      body: {
        type: 'object',
        properties: {
          TeamId: { type: 'integer' }
        }
      },
      response: {
        200: confirmation
      }
    }
  }

  const removeTeamOpts ={
    handler: removeTeam,
    schema: {
      body: {
        type: 'object',
        properties: {
          TeamId: { type: 'integer' }
        }
      },
      response: {
        200: confirmation
      }
    }
  }
  
  const deleteEventOpts = {
    handler: deleteEvent,
    schema: {
      response: {
        200: confirmation
      }
    }
  } 

  fastify.get('/events/:id', getEventOpts)
  
  fastify.get('/events', getEventsOpts)

  fastify.post('/events/create', createEventOpts)

  fastify.put('/events/:id/edit', editEventOpts)

  fastify.put('/events/:id/addTeam', addTeamOpts)

  fastify.put('/events/:id/removeTeam', removeTeamOpts)

  fastify.delete('/events/:id/delete', deleteEventOpts)

  done()
}