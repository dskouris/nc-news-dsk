const commentsRouter = require('express').Router();
const {
  updateComment,
  removeComment
} = require('../controllers/commentsControllers');
const { send405 } = require('../errors/index');

commentsRouter
  .route('/:id')
  .patch(updateComment)
  .delete(removeComment)
  .all(send405);

module.exports = commentsRouter;
