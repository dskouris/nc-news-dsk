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

exports.fetchCommentsForArticle = (
  id,
  sortBy = 'created_at',
  order = 'desc'
) => {
  return knex('comments')
    .select('*')
    .where({ article_id: id })
    .orderBy(sortBy, order)
    .then(comments => {
      return { comments };
    });
};

exports.modifyComment = (id, votes) => {
  if (typeof votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  } else {
    return knex('comments')
      .where({ comment_id: id })
      .increment('votes', votes)
      .returning('*')
      .then(comment => {
        return { comment: comment[0] };
      });
  }
};

exports.deleteComment = id => {
  return knex('comments')
    .where({ comment_id: id })
    .del();
};

exports.checkIfCommentExists = id => {
  return knex('comments')
    .select('*')
    .where({ comment_id: id });
};
