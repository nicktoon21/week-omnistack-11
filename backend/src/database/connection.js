const knex = require('knex');

const configuration = require('../../knexfile');
const env = require('../config/env');

const connection = knex(configuration[env.nodeEnv] || configuration.development);

module.exports = connection;
