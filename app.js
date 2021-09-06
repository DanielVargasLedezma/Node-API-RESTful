"use strict";

var express = require("express");
const { restart } = require("nodemon");

//Express
var app = express();

//Rutas para el API
var article_routes = require('./routes/article');

//XD
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Routing
app.use('/api', article_routes);

module.exports = app;