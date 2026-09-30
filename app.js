const express = require('express');
const cors = require('cors');
const productRouter = require('./routes/productRouter');
const {
  unknownEndpoint,
  errorHandler,
  requestLogger,
} = require('./middleware/customMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/products', productRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;