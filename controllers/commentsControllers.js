const {
  postComment,
  fetchCommentsForArticle,
  modifyComment,
  deleteComment
} = require('../models/commentsModels');

exports.sendComment = (req, res, next) => {
  const commentBody = req.body;
  postComment(commentBody)
    .then(newComment => res.status(201).send(newComment))
    .catch(next);
};

exports.getCommentsForArticle = (req, res, next) => {
  const sorter = req.query.sort_by;
  const { order } = req.query;
  const { id } = req.params;
  fetchCommentsForArticle(id, sorter, order)
    .then(comments => res.status(200).send(comments))
    .catch(next);
};

exports.updateComment = (req, res, next) => {
  const { id } = req.params;
  const { inc_votes } = req.body;
  modifyComment(id, inc_votes)
    .then(comment => res.status(200).send(comment))
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { id } = req.params;
  deleteComment(id)
    .then(deleteCount => {
      return deleteCount > 0
        ? res.sendStatus(204)
        : res.status(404).send({ msg: 'Comment not found' });
    })
    .catch(next);
};
