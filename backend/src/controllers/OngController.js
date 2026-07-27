const crypto = require('node:crypto');

const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const ongs = await connection('ongs').select('*');

    return response.json(ongs);
  },

  async create(request, response) {
    const { name, email, whatsapp, city, uf } = request.validated.body;

    const id = crypto.randomBytes(4).toString('hex');

    await connection('ongs').insert({ id, name, email, whatsapp, city, uf });

    return response.status(201).json({ id });
  },
};
