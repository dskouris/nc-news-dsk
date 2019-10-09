const commentsRouter = require('express').Router();
const {
  updateComment,
  removeComment
} = require('../controllers/commentsControllers');

commentsRouter
  .route('/:id')
  .patch(updateComment)
  .delete(removeComment);

module.exports = commentsRouter;
