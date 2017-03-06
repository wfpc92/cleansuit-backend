'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const VersionApp = mongoose.model('VersionApp')

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

  subservicesSchema.post('save', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  subservicesSchema.post('findOneAndUpdate', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  /**
   * Register the schema.
   */
  const Subservices = restful.model('Subservicios', subservicesSchema);

  return Subservices;
};
