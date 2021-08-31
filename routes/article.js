'use strict'

var express = require("express");
var ArticleController = require('../controllers/article');

var router = express.Router();

//Rutas de prueba
router.get('/test-de-article', ArticleController.articleTest);
router.post('/test-de-controllador', ArticleController.test);

//Rutas utiles
router.post('/save', ArticleController.save);

module.exports = router;