const { fetchUser } = require('../models/usersModels');

exports.getUser = (req, res, next) => {
  fetchUser(req.params)
    .then(user => res.status(200).send({ user: user[0] }))
    .catch(next);
};
