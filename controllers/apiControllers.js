const endPoints = require('../endpoints.json');

exports.sendEndPoints = (req, res, next) => {
  res.status(200).send(endPoints);
};
