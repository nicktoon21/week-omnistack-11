const connection = require('../database/connection');
const AppError = require('../errors/AppError');
const env = require('../config/env');

// `returning` devolve objetos no Postgres e escalares em alguns drivers.
const toId = (row) => (row && typeof row === 'object' ? row.id : row);

module.exports = {
  async index(request, response) {
    const { page } = request.validated.query;
    const pageSize = env.pageSize;

    // Alias explícito: `count(*)` como chave varia entre drivers.
    const [{ count }] = await connection('incidents').count('* as count');

    const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .orderBy('incidents.id', 'desc')
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .select(
        'incidents.*',
        'ongs.name',
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf',
      );

    response.header('X-Total-Count', String(count));

    return response.json(incidents);
  },

  async create(request, response) {
    const { title, description, values } = request.validated.body;

    const [row] = await connection('incidents')
      .insert({ title, description, values, ong_id: request.ongId })
      .returning('id');

    return response.status(201).json({ id: toId(row) });
  },

  async delete(request, response) {
    const { id } = request.validated.params;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

    if (!incident) {
      throw new AppError('Caso não encontrado.', 404);
    }

    if (incident.ong_id !== request.ongId) {
      throw new AppError('Operação não permitida.', 403);
    }

    await connection('incidents').where('id', id).delete();

    return response.status(204).send();
  },
};
