const articlesRouter = require('express').Router();
const {
  getArticle,
  updateArticle,
  getAllArticles
} = require('../controllers/articlesControllers');
const {
  sendComment,
  getCommentsForArticle
} = require('../controllers/commentsControllers');
const { send405 } = require('../errors/index');

articlesRouter
  .route('/')
  .get(getAllArticles)
  .all(send405);

articlesRouter
  .route('/:id')
  .get(getArticle)
  .patch(updateArticle)
  .all(send405);

articlesRouter
  .route('/:id/comments')
  .post(sendComment)
  .get(getCommentsForArticle)
  .all(send405);

module.exports = articlesRouter;
