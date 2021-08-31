"use strict";

var express = require("express");
var bodyParser = require("body-parser");
const { restart } = require("nodemon");

var app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/articles", (req, res) => {

    return res.status(200).send({
        
    });
});

module.exports = app;
