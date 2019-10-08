const { postComment } = require('../models/commentsModels');

exports.sendComment = (req, res, next) => {
  const commentBody = req.body;
  postComment(commentBody).catch(next);
};
