const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const env = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
    // Sem isso o browser não enxerga o cabeçalho de paginação.
    exposedHeaders: ['X-Total-Count'],
  }),
);
app.use(express.json({ limit: '100kb' }));

if (!env.isTest) {
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    }),
  );
}

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
