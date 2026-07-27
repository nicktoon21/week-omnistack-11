const jwt = require('jsonwebtoken');

const AppError = require('../errors/AppError');
const env = require('../config/env');

/**
 * Exige um `Authorization: Bearer <token>` válido e expõe a ONG
 * autenticada em `request.ongId`.
 */
function auth(request, response, next) {
  const header = request.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Token de autenticação ausente.', 401);
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    request.ongId = payload.sub;
    return next();
  } catch {
    throw new AppError('Token de autenticação inválido ou expirado.', 401);
  }
}

module.exports = auth;
