const express = require('express');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const auth = require('./middlewares/auth');
const validate = require('./middlewares/validate');
const {
  createOngSchema,
  createSessionSchema,
  createIncidentSchema,
  paginationSchema,
  incidentIdSchema,
} = require('./schemas');

const routes = express.Router();

routes.get('/health', (request, response) => response.json({ status: 'ok' }));

routes.post(
  '/session',
  validate({ body: createSessionSchema }),
  SessionController.create,
);

routes.get('/ongs', OngController.index);
routes.post('/ongs', validate({ body: createOngSchema }), OngController.create);

routes.get('/profile', auth, ProfileController.index);

routes.get(
  '/incidents',
  validate({ query: paginationSchema }),
  IncidentController.index,
);
routes.post(
  '/incidents',
  auth,
  validate({ body: createIncidentSchema }),
  IncidentController.create,
);
routes.delete(
  '/incidents/:id',
  auth,
  validate({ params: incidentIdSchema }),
  IncidentController.delete,
);

module.exports = routes;
