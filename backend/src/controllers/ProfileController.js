const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
    const incidents = await connection('incidents')
      .where('ong_id', request.ongId)
      .orderBy('id', 'desc')
      .select('*');

    return response.json(incidents);
  },
};
