const articlesRouter = require('express').Router();
const {
  getArticle,
  updateArticle
} = require('../controllers/articlesControllers');

articlesRouter
  .route('/:id')
  .get(getArticle)
  .patch(updateArticle);

module.exports = articlesRouter;
