const { postComment } = require('../models/commentsModels');

exports.sendComment = (req, res, next) => {
  const commentBody = req.body;
  postComment(commentBody)
    .then(newComment => {
      res.status(201).send(newComment);
    })
    .catch(next);
};
