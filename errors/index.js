exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
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
  }
};
