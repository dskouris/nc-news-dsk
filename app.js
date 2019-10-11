const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
const { handleCustomErrors, handlePSQLErrors } = require('./errors/index');

app.use(express.json());

app.use('/api', apiRouter);
app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.all('/*', (req, res, next) =>
  res.status(404).send({ msg: 'Route not found' })
);

module.exports = app;
