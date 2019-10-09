exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const errorCodes = ['42703'];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: 'bad request' });
  } else {
    next(err);
  }
};
