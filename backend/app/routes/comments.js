module.exports = function (fastify, opts, done) {

  const { getComment, getComments, createComment, editComment, deleteComment } = require('../controlers/comments')(fastify);
  const { headers, confirmation } = require('../schema');
  const { commentInfo, commentBody } = require('../schema/comments');
  
  const getCommentOpts = {
    preHandler: fastify.auth,
    handler: getComment,
    schema:{
      headers,
      response:{
        200: commentInfo
      }
    }
  };

  const getCommentsOpts = {
    preHandler: fastify.auth,
    handler: getComments,
    schema:{
      headers,
      response:{
        200: {
          type: 'array',
          items: commentInfo
        }
      }
    }
  };

  const createCommentOpts = {
    preHandler: fastify.auth,
    handler: createComment,
    schema: {
      headers,
      body: commentBody,
      response:{
        201: commentInfo
      }
    }
  };

  const editCommentOpts = {
    preHandler: fastify.auth,
    handler: editComment,
    schema: {
      headers,
      body: commentBody,
      response: {
        200: commentInfo
      }
    }
  }
  
  const deleteCommentOpts = {
    preHandler: fastify.auth,
    handler: deleteComment,
    schema: {
      headers,
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