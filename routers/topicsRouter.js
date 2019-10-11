const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topicsControllers');
const { send405 } = require('../errors/index');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(send405);

module.exports = topicsRouter;
