const express = require(`express`);

const OngController = require(`./controllers/OngController`)
const IncidentController = require(`./controllers/IncidentController`)
const ProfileController = require(`./controllers/ProfileController`)
const SessionController = require(`./controllers/SessionController`)

const routes = express.Router();

routes.post('/session', SessionController.create);//Criar

routes.get('/ongs', OngController.index);//Listagem
routes.post('/ongs', OngController.create);//Criar

routes.get('/profile', ProfileController.index);//Listagem

routes.get('/incidents', IncidentController.index);//Listagem
routes.post('/incidents', IncidentController.create);//Criar

routes.delete('/incidents/:id', IncidentController.delete); //Apagar

module.exports = routes;
