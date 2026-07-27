const { app, request, validOng } = require('./helpers');

describe('POST /ongs', () => {
  it('cria uma ONG e devolve o ID de acesso', async () => {
    const response = await request(app).post('/ongs').send(validOng());

    expect(response.status).toBe(201);
    expect(response.body.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('normaliza a UF para maiúsculas', async () => {
    const created = await request(app)
      .post('/ongs')
      .send(validOng({ uf: 'rj' }))
      .expect(201);

    const ongs = await request(app).get('/ongs').expect(200);
    const ong = ongs.body.find((item) => item.id === created.body.id);

    expect(ong.uf).toBe('RJ');
  });

  it('rejeita e-mail inválido com 422', async () => {
    const response = await request(app)
      .post('/ongs')
      .send(validOng({ email: 'nao-e-email' }));

    expect(response.status).toBe(422);
    expect(response.body.details).toContainEqual(
      expect.objectContaining({ field: 'body.email' }),
    );
  });

  it('rejeita whatsapp fora do formato esperado', async () => {
    const response = await request(app)
      .post('/ongs')
      .send(validOng({ whatsapp: '123' }));

    expect(response.status).toBe(422);
  });

  it('rejeita UF com mais de duas letras', async () => {
    const response = await request(app)
      .post('/ongs')
      .send(validOng({ uf: 'SPP' }));

    expect(response.status).toBe(422);
  });
});
