'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const subservicesSchema = new mongoose.Schema({
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicios'
    },
    nombre: String,
    descripcion: String,
    precio: Number,
    detalles: String
  });

  /**
   * Register the schema.
   */
  const Subservices = restful.model('Subservicios', subservicesSchema);

  return Subservices;
};
