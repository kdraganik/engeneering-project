module.exports = function (fastify, opts, done) {

  const { getComment, getComments, createComment, editComment, deleteComment } = require('../controlers/comments')(fastify);
  const { confirmation } = require('../schema');
  const { commentInfo, commentObject, commentBody } = require('../schema/comments');
  
  const getCommentOpts = {
    handler: getComment,
    schema:{
      response:{
        200: commentObject
      }
    }
  };

  const getCommentsOpts = {
    handler: getComments,
    schema:{
      response:{
        200: {
          type: 'array',
          items: commentObject
        }
      }
    }
  };

  const createCommentOpts = {
    handler: createComment,
    schema: {
      body: commentBody,
      response:{
        201: commentInfo
      }
    }
  };

  const editCommentOpts = {
    handler: editComment,
    schema: {
      body: commentBody,
      response: {
        200: commentInfo
      }
    }
  }
  
  const deleteCommentOpts = {
    handler: deleteComment,
    schema: {
      response: {
        200: confirmation
      }
    }
  }

  fastify.get('/comments/:id', getCommentOpts);
  
  fastify.get('/comments', getCommentsOpts);

  fastify.post('/comments/create', createCommentOpts);

  fastify.put('/comments/:id/edit', editCommentOpts);

  fastify.delete('/comments/:id/delete', deleteCommentOpts);

  done()
}