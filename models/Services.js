'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const servicesSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    subservicios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subservicios'
    }]
  });

  /**
   * Register the schema.
   */
  const Services = restful.model('Servicios', servicesSchema);

  return Services;
};
