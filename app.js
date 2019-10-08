const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const { handleCustomErrors } = require('./errors/index');

app.use('/api', apiRouter);
app.use(handleCustomErrors);
app.all('/*', (req, res, next) =>
  res.status(404).send({ msg: 'Route not found' })
);

module.exports = app;
