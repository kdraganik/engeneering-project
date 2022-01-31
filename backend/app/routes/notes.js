module.exports = function (fastify, opts, done) {

  const { getNote, getNotes, createNote, editNote, deleteNote } = require('../controlers/notes')(fastify);
  const { headers, confirmation } = require('../schema');
  const { noteInfo, noteBody } = require('../schema/notes'); 
  
  const getNoteOpts = {
    preHandler: fastify.auth,
    handler: getNote,
    schema:{
      headers,
      response:{
        200: noteInfo
      }
    }
  };

  const getNotesOpts = {
    preHandler: fastify.auth,
    handler: getNotes,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: noteInfo
        }
      }
    }
  };

  const createNoteOpts = {
    preHandler: fastify.auth,
    handler: createNote,
    schema: {
      headers,
      body: noteBody,
      response:{
        201: noteInfo
      }
    }
  };

  const editNoteOpts = {
    preHandler: fastify.auth,
    handler: editNote,
    schema: {
      headers,
      body: noteBody,
      response: {
        200: noteInfo
      }
    }
  }
  
  const deleteNoteOpts = {
    preHandler: fastify.auth,
    handler: deleteNote,
    schema: {
      headers,
      response: {
        200: confirmation
      }
    }
  } 

  fastify.get('/notes/:id', getNoteOpts)
  
  fastify.get('/notes', getNotesOpts)

  fastify.post('/notes/create', createNoteOpts)

  fastify.put('/notes/:id/edit', editNoteOpts)

  fastify.delete('/notes/:id/delete', deleteNoteOpts)

  done()
}