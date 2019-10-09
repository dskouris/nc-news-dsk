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

articlesRouter.route('/').get(getAllArticles);

articlesRouter
  .route('/:id')
  .get(getArticle)
  .patch(updateArticle);

articlesRouter
  .route('/:id/comments')
  .post(sendComment)
  .get(getCommentsForArticle);

module.exports = articlesRouter;
