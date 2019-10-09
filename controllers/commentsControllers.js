const {
  postComment,
  fetchCommentsForArticle
} = require('../models/commentsModels');

exports.sendComment = (req, res, next) => {
  const commentBody = req.body;
  postComment(commentBody)
    .then(newComment => {
      res.status(201).send(newComment);
    })
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const sorter = req.query.sort_by;
  const { order } = req.query;
  const { id } = req.params;
  fetchCommentsForArticle(id, sorter, order)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(next);
};
