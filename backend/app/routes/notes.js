module.exports = function (fastify, opts, done) {

  const { getNote, getNotes, createNote, editNote, deleteNote } = require('../controlers/notes')(fastify);
  const { confirmation } = require('../schema');
  const { noteInfo, noteObject, noteBody } = require('../schema/notes');
  
  const getNoteOpts = {
    handler: getNote,
    schema:{
      response:{
        200: noteObject
      }
    }
  };

  const getNotesOpts = {
    handler: getNotes,
    schema:{
      response:{
        200: {
          type: 'array',
          items: noteObject
        }
      }
    }
  };

  const createNoteOpts = {
    handler: createNote,
    schema: {
      body: noteBody,
      response:{
        201: noteInfo
      }
    }
  };

  const editNoteOpts = {
    handler: editNote,
    schema: {
      body: noteBody,
      response: {
        200: noteInfo
      }
    }
  }
  
  const deleteNoteOpts = {
    handler: deleteNote,
    schema: {
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