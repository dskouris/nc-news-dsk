const knex = require('../connection');

exports.postComment = comment => {
  return knex
    .insert(comment)
    .into('comments')
    .returning('*')
    .then(postedComment => {
      console.log(postedComment);
    });
};
