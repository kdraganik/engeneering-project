module.exports = function(fastify){
  const getNote = async (request, reply) => {
    const {id} = request.params;
    const note = await fastify.db.models.Note.findOne({
      where: {
        id
      },
      attributes: ['id', 'title', 'content', 'EventId']
    });

    if(note){
      reply.send(note);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No note with given id"
      })
    }
  };

  const getNotes = async (request, reply) => {
    const notes = await fastify.db.models.Note.findAll({
      attributes: ['id', 'title', 'content', 'EventId'],
    });
    
    reply.send(notes);
  }

  const editNote = async (request, reply) => {
    const {id} = request.params;
    const note = await fastify.db.models.Note.findOne({
        where: {
          id
        }
    })

    if(note){
      const { title, content } = request.body;

      note.title = title || note.title;
      note.content = content || note.content;
      await note.save();

      reply.send(note);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No note with given id"
      })
    }
  };

  const createNote = async (request, reply) => {
    const { title, content, EventId } = request.body;
    
    const newNote = await fastify.db.models.Note.create({
      title,
      content,
      EventId
    })

    reply.status(201).send(newNote);
  };

  const deleteNote = async (request, reply) => {
    const {id} = request.params;
    const note = await fastify.db.models.Note.findOne({
        where: {
          id
        }
    });

    if(note){
      await note.destroy();

      reply.send({
          statusCode: 200,
          message: `Note (id: ${id}) removed successfully`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No note with given id"
      })
    }
  };

  return { 
    getNote, 
    getNotes, 
    createNote, 
    editNote, 
    deleteNote 
  }
}