require('dotenv').config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jwtSecret = process.env.JWT_SECRET;

if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

module.exports = {
  nodeEnv,
  isProduction,
  isTest: nodeEnv === 'test',
  port: Number(process.env.PORT) || 3333,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwt: {
    secret: jwtSecret || 'dev-only-insecure-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    filename: process.env.DATABASE_FILENAME || './src/database/db.sqlite',
    url: process.env.DATABASE_URL,
  },
  pageSize: Number(process.env.PAGE_SIZE) || 5,
};
