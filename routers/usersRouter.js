const usersRouter = require('express').Router();
const { getUser } = require('../controllers/usersControllers');
const { send405 } = require('../errors/index');

usersRouter
  .route('/:user')
  .get(getUser)
  .all(send405);

module.exports = usersRouter;
