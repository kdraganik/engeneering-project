module.exports = function(fastify){
  const getComment = async (request, reply) => {
    const {id} = request.params;
    const comment = await fastify.db.models.Comment.findOne({
      where: {
        id
      },
      attributes: ['id', 'content', 'date', 'TaskId', 'UserId']
    });

    if(comment){
      reply.send(comment);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No comment with given id"
      })
    }
  };

  const getComments = async (request, reply) => {
    const comments = await fastify.db.models.Comment.findAll({
      attributes: ['id', 'content', 'date', 'TaskId', 'UserId']
    });
    
    reply.send(comments);
  };

  const createComment = async (request, reply) => {
    const { content, TaskId, UserId } = request.body;

    date = new Date();
    
    const newComment = await fastify.db.models.Comment.create({
      content,
      date,
      TaskId,
      UserId
    })

    reply.status(201).send(newComment);
  };

  const editComment = async (request, reply) => {
    const {id} = request.params;
    const comment = await fastify.db.models.Comment.findOne({
        where: {
          id
        }
    })

    if(comment){
      const { content } = request.body;

      comment.content = content || comment.content;
      await comment.save();

      reply.send(comment);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No comment with given id"
      })
    }
  };

  const deleteComment = async (request, reply) => {
    const {id} = request.params;
    const comment = await fastify.db.models.Comment.findOne({
        where: {
          id
        }
    });

    if(comment){
      await comment.destroy();

      reply.send({
          statusCode: 200,
          message: `Comment (id: ${id}) removed successfully`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No comment with given id"
      })
    }
  };

  return { 
    getComment, 
    getComments, 
    createComment, 
    editComment, 
    deleteComment 
  }
}