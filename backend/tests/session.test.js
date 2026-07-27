const { app, request, validOng } = require('./helpers');

describe('POST /session', () => {
  it('devolve nome e token JWT para um ID existente', async () => {
    const created = await request(app)
      .post('/ongs')
      .send(validOng({ name: 'Casa do Zezinho' }))
      .expect(201);

    const response = await request(app)
      .post('/session')
      .send({ id: created.body.id });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Casa do Zezinho');
    expect(response.body.token.split('.')).toHaveLength(3);
  });

  it('responde 401 quando o ID não existe', async () => {
    const response = await request(app)
      .post('/session')
      .send({ id: 'deadbeef' });

    expect(response.status).toBe(401);
  });

  it('responde 422 quando o ID está fora do formato', async () => {
    const response = await request(app).post('/session').send({ id: 'xyz' });

    expect(response.status).toBe(422);
  });
});
