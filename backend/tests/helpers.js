const request = require('supertest');

const app = require('../src/app');

const validOng = (overrides = {}) => ({
  name: 'APAD',
  email: 'contato@apad.org',
  whatsapp: '11999998888',
  city: 'São Paulo',
  uf: 'SP',
  ...overrides,
});

/** Cria uma ONG e devolve `{ id, name, token }` já autenticado. */
async function createAuthenticatedOng(overrides = {}) {
  const payload = validOng(overrides);

  const created = await request(app).post('/ongs').send(payload).expect(201);
  const session = await request(app)
    .post('/session')
    .send({ id: created.body.id })
    .expect(200);

  return { id: created.body.id, name: session.body.name, token: session.body.token };
}

module.exports = { app, request, validOng, createAuthenticatedOng };
