const articlesRouter = require('express').Router();
const {
  getArticle,
  updateArticle
} = require('../controllers/articlesControllers');
const { sendComment } = require('../controllers/commentsControllers');

articlesRouter
  .route('/:id')
  .get(getArticle)
  .patch(updateArticle);

articlesRouter.route('/:id/comments').post(sendComment);
module.exports = articlesRouter;
