const env = require('./src/config/env');

const migrations = {
  directory: './src/database/migrations',
  tableName: 'knex_migrations',
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: { filename: env.database.filename },
    migrations,
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    migrations,
    useNullAsDefault: true,
    // Uma única conexão persistente: o banco em memória morre junto com ela.
    pool: { min: 1, max: 1 },
  },

  production: {
    client: 'pg',
    connection: env.database.url,
    migrations,
    pool: { min: 2, max: 10 },
  },
};
