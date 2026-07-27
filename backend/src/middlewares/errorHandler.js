const AppError = require('../errors/AppError');
const env = require('../config/env');

function notFound(request, response) {
  return response.status(404).json({ error: 'Rota não encontrada.' });
}

// Express 5 encaminha rejeições de handlers async para cá automaticamente.
// eslint-disable-next-line no-unused-vars
function errorHandler(error, request, response, next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (!env.isTest) {
    console.error(error);
  }

  return response.status(500).json({ error: 'Erro interno do servidor.' });
}

module.exports = { notFound, errorHandler };
