"use strict";

var validator = require("validator");
var Article = require("../models/article");

var controller = {
  articleTest: (req, res) => {
    return res.status(200).send({
      name: "Probando",
      createdDate: {
        day: new Date().getDate(),
        week: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      createdHour: {
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
        seconds: new Date().getSeconds(),
      },
      extra: "Puto",
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Soy el test",
    });
  },
  save: (req, res) => {
    var params = req.body;

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "Error",
        message: "Faltan datos por llegar",
      });
    }

    if (validate_title && validate_content) {
      var article = new Article();

      article.title = params.title;
      article.content = params.content;
      article.image = null;

      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "Error",
            article: "El articulo no se ha guardado",
          });
        } else {
          return res.status(200).send({
            status: "Success",
            article: articleStored,
          });
        }
      });
    } else {
      return res.status(200).send({
        status: "Error",
        article: "Validacion incorrecta",
      });
    }
  },
};

module.exports = controller;
