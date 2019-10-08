const articlesRouter = require('express').Router();
const { getArticle } = require('../controllers/articlesControllers');

articlesRouter.route('/:id').get(getArticle);

module.exports = articlesRouter;
