const connection = require('../src/database/connection');

beforeAll(async () => {
  await connection.migrate.latest();
});

afterAll(async () => {
  await connection.destroy();
});
