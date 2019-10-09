const knex = require('../connection');

exports.postComment = comment => {
  comment.author = comment.username;
  delete comment.username;
  return knex
    .insert(comment)
    .into('comments')
    .returning('*')
    .then(postedComment => {
      return { new_comment: postedComment[0] };
    });
};
