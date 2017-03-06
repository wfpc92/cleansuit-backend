'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const VersionApp = mongoose.model('VersionApp')

  const servicesSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    subservicios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subservicios'
    }]
  });

  servicesSchema.post('save', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  servicesSchema.post('findOneAndUpdate', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  /**
   * Register the schema.
   */
  const Services = restful.model('Servicios', servicesSchema);

  return Services;
};
