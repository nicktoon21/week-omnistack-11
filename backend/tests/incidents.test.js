const { app, request, createAuthenticatedOng } = require('./helpers');

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe('Casos (incidents)', () => {
  it('cria um caso para a ONG autenticada', async () => {
    const ong = await createAuthenticatedOng();

    const response = await request(app)
      .post('/incidents')
      .set(bearer(ong.token))
      .send({ title: 'Cadelinha atropelada', description: 'Precisa de cirurgia', values: 120 });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeGreaterThan(0);
  });

  it('exige autenticação para criar', async () => {
    const response = await request(app)
      .post('/incidents')
      .send({ title: 'x', description: 'y', values: 10 });

    expect(response.status).toBe(401);
  });

  it('rejeita token inválido', async () => {
    const response = await request(app)
      .post('/incidents')
      .set(bearer('token.invalido.aqui'))
      .send({ title: 'x', description: 'y', values: 10 });

    expect(response.status).toBe(401);
  });

  it('rejeita valor não positivo com 422', async () => {
    const ong = await createAuthenticatedOng();

    const response = await request(app)
      .post('/incidents')
      .set(bearer(ong.token))
      .send({ title: 'x', description: 'y', values: -5 });

    expect(response.status).toBe(422);
  });

  it('lista casos com X-Total-Count exposto e pagina o resultado', async () => {
    const ong = await createAuthenticatedOng({ email: 'lista@ong.org' });

    for (let i = 0; i < 7; i += 1) {
      await request(app)
        .post('/incidents')
        .set(bearer(ong.token))
        .send({ title: `Caso ${i}`, description: 'desc', values: 10 + i })
        .expect(201);
    }

    const first = await request(app).get('/incidents').expect(200);

    expect(Number(first.headers['x-total-count'])).toBeGreaterThanOrEqual(7);
    expect(first.body).toHaveLength(5);
    expect(first.body[0]).toHaveProperty('name');

    const second = await request(app).get('/incidents?page=2').expect(200);
    expect(second.body.length).toBeGreaterThan(0);
    expect(second.body[0].id).not.toBe(first.body[0].id);
  });

  it('rejeita página inválida com 422', async () => {
    const response = await request(app).get('/incidents?page=0');

    expect(response.status).toBe(422);
  });

  it('lista no /profile apenas os casos da própria ONG', async () => {
    const alpha = await createAuthenticatedOng({ email: 'alpha@ong.org' });
    const beta = await createAuthenticatedOng({ email: 'beta@ong.org' });

    await request(app)
      .post('/incidents')
      .set(bearer(alpha.token))
      .send({ title: 'Só da Alpha', description: 'desc', values: 50 })
      .expect(201);

    const response = await request(app)
      .get('/profile')
      .set(bearer(beta.token))
      .expect(200);

    expect(response.body).toHaveLength(0);
  });

  it('exige autenticação no /profile', async () => {
    const response = await request(app).get('/profile');

    expect(response.status).toBe(401);
  });
});

describe('DELETE /incidents/:id', () => {
  it('apaga o caso da própria ONG', async () => {
    const ong = await createAuthenticatedOng({ email: 'dono@ong.org' });

    const created = await request(app)
      .post('/incidents')
      .set(bearer(ong.token))
      .send({ title: 'Para apagar', description: 'desc', values: 30 })
      .expect(201);

    await request(app)
      .delete(`/incidents/${created.body.id}`)
      .set(bearer(ong.token))
      .expect(204);

    const profile = await request(app)
      .get('/profile')
      .set(bearer(ong.token))
      .expect(200);

    expect(profile.body.map((i) => i.id)).not.toContain(created.body.id);
  });

  it('responde 403 ao tentar apagar caso de outra ONG', async () => {
    const dono = await createAuthenticatedOng({ email: 'd1@ong.org' });
    const intruso = await createAuthenticatedOng({ email: 'd2@ong.org' });

    const created = await request(app)
      .post('/incidents')
      .set(bearer(dono.token))
      .send({ title: 'Protegido', description: 'desc', values: 30 })
      .expect(201);

    const response = await request(app)
      .delete(`/incidents/${created.body.id}`)
      .set(bearer(intruso.token));

    expect(response.status).toBe(403);
  });

  it('responde 404 quando o caso não existe', async () => {
    const ong = await createAuthenticatedOng({ email: 'x404@ong.org' });

    const response = await request(app)
      .delete('/incidents/999999')
      .set(bearer(ong.token));

    expect(response.status).toBe(404);
  });
});
