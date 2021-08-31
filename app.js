"use strict";

var express = require("express");
var bodyParser = require("body-parser");
const { restart } = require("nodemon");

var app = express();

var article_routes = require('./routes/article');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', article_routes);

module.exports = app;
