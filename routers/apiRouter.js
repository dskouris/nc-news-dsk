const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const { sendEndPoints } = require('../controllers/apiControllers');
const { send405 } = require('../errors/index');

apiRouter
  .route('/')
  .get(sendEndPoints)
  .all(send405);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
