const usersRouter = require('express').Router();
const { getUser } = require('../controllers/usersControllers');

usersRouter.route('/:user').get(getUser);

module.exports = usersRouter;
