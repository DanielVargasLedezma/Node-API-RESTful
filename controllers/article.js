"use strict";

var validator = require("validator");
var fs = require("fs");
var path = require("path");

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
        status: "error",
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
            status: "error",
            article: "El articulo no se ha guardado",
          });
        } else {
          return res.status(200).send({
            status: "success",
            article: articleStored,
          });
        }
      });
    } else {
      return res.status(200).send({
        status: "error",
        article: "Validacion incorrecta",
      });
    }
  },
  getArticles: (req, res) => {
    var query = Article.find({});

    var last = req.params.last;

    if (last) {
      query.limit(5);
    }

    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los datos",
        });
      }

      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No hay datos que revolver",
        });
      }

      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },
  getArticle: (req, res) => {
    var id = req.params.id;

    if (!id) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    Article.findById(id, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "error",
          message: "No se encontro dicho articulo",
        });
      }

      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },
  update: (req, res) => {
    var id = req.params.id;

    if (!id) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
      });
    }

    var params = req.body;

    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(404).send({
        status: "error",
        message: "Faltan datos por enviar",
      });
    }

    if (validate_title && validate_content) {
      Article.findByIdAndUpdate(
        { _id: id },
        params,
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "Error al actualizar o no se encontro el articulo",
            });
          }

          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(500).send({
        status: "error",
        message: "La validacion no es correcta",
      });
    }
  },
  delete: (req, res) => {
    var id = req.params.id;

    Article.findByIdAndDelete({ _id: id }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(404).send({
          status: "error",
          message: "Error al borrar o no se encontro el articulo",
        });
      }

      return res.status(200).send({
        status: "success",
        article: articleRemoved,
      });
    });
  },
  upload: (req, res) => {
    var file = "Imagen no subida...";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file,
      });
    }

    var file_path = req.files.file0.path;
    var file_split = file_path.split("\\");

    var file_name = file_split[2];

    var file_extension_split = file_name.split(".");
    var file_extension = file_extension_split[1];

    if (
      file_extension != "png" &&
      file_extension != "jpg" &&
      file_extension != "jpeg" &&
      file_extension != "gif"
    ) {
      fs.unlink(file_path, (err) => {
        return res.status(500).send({
          status: "error",
          message: "La extension del archivo no es valida",
        });
      });
    } else {
      var id = req.params.id;

      if (!id) {
        fs.unlink(file_path, (err) => {
          return res.status(500).send({
            status: "error",
            message: "No se digito el ID",
          });
        });
      }

      Article.findOneAndUpdate(
        { _id: id },
        { image: file_name },
        (err, article) => {
          if (err || !article) {
            fs.unlink(file_path, (err) => {
              return res.status(500).send({
                status: "error",
                message: "Error al actualizar o no existe el articulo",
              });
            });
          }
          if (article) {
            if (article.image) {
              var old_image_path = "upload\\articles\\" + article.image;
              fs.unlink(old_image_path, (err) => {
                if (err) {
                  return res.status(500).send({
                    status: "error",
                    message: "Error fs unlink",
                  });
                }
              });
            }
          }
          return res.status(200).send({
            status: "success",
            article: article,
          });
        }
      );
    }
  },
};

module.exports = controller;
