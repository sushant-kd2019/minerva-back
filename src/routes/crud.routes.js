const express = require('express')
const route = express.Router()

const roadmapsController = require('../controllers/crud.controller');


// API
route.post('/', roadmapsController.create);
route.get('/', roadmapsController.find);  // query params: userId, type (created/forked)
route.put('/:roadmapId', roadmapsController.update);
route.delete('/:roadmapId', roadmapsController.delete);
route.post('/fork/:roadmapId',roadmapsController.fork);
route.get('/search',roadmapsController.search);  //query param: q
route.post('/star/:roadmapId',roadmapsController.star)

module.exports = route