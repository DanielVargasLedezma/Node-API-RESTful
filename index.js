"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3900;

const url = "mongodb://localhost:27017/api_rest_blog";

// mongoose.set('useFindAndModify', false);

mongoose.Promise = global.Promise;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("La conexion se ha ejecutado!");

    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:'+ port);
    });

    
  });
