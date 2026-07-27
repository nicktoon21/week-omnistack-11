const jwt = require('jsonwebtoken');

const connection = require('../database/connection');
const AppError = require('../errors/AppError');
const env = require('../config/env');

module.exports = {
  async create(request, response) {
    const { id } = request.validated.body;

    const ong = await connection('ongs')
      .where('id', id)
      .select('id', 'name')
      .first();

    if (!ong) {
      throw new AppError('Nenhuma ONG encontrada com este ID.', 401);
    }

    const token = jwt.sign({}, env.jwt.secret, {
      subject: ong.id,
      expiresIn: env.jwt.expiresIn,
    });

    return response.json({ name: ong.name, token });
  },
};
