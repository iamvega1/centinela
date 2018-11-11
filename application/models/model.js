'use strict';

const mongoose = require('mongoose'),
    conf = require('./db-conf');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
  .catch(
    // Registrar la razón del rechazo
    function(reason) {
      console.log('Manejar promesa rechazada ('+reason+') aquí.');
    });

module.exports = mongoose;