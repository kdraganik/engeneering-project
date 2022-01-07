module.exports = function (fastify, opts, done) {

  const { getEvent, getEvents, createEvent, editEvent, deleteEvent, addTeam, removeTeam } = require('../controlers/events')(fastify);
  const { headers, confirmation } = require('../schema');
  const { eventInfo, eventBody, eventObject } = require('../schema/events');

  const getEventOpts = {
    preHandler: fastify.auth,
    handler: getEvent,
    schema:{
      headers,
      response:{
        200: eventObject
      }
    }
  };

  const getEventsOpts = {
    preHandler: fastify.auth,
    handler: getEvents,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: eventObject
        }
      }
    }
  };

  const createEventOpts = {
    preHandler: fastify.auth,
    handler: createEvent,
    schema: {
      headers,
      body: eventBody,
      response:{
        201: eventInfo
      }
    }
  };

  const editEventOpts = {
    preHandler: fastify.auth,
    handler: editEvent,
    schema: {
      headers,
      body: eventBody,
      response: {
        200: eventInfo
      }
    }
  }

  const deleteEventOpts = {
    preHandler: fastify.auth,
    handler: deleteEvent,
    schema: {
      headers,
      response: {
        200: confirmation
      }
    }
  }

  const addTeamOpts ={
    preHandler: fastify.auth,
    handler: addTeam,
    schema: {
      headers,
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
    preHandler: fastify.auth,
    handler: removeTeam,
    schema: {
      headers,
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

  fastify.get('/events/:id', getEventOpts)
  
  fastify.get('/events', getEventsOpts)

  fastify.post('/events/create', createEventOpts)

  fastify.put('/events/:id/edit', editEventOpts)

  fastify.delete('/events/:id/delete', deleteEventOpts)

  fastify.put('/events/:id/addTeam', addTeamOpts)

  fastify.put('/events/:id/removeTeam', removeTeamOpts)

  done()
}