'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const invoicesSchema = new mongoose.Schema({
    orden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordenes'
    },
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios'
    },
    domiciliario_recoleccion_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios'
    },
    domiciliario_entrega_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuarios'
    },
    servicioDirecto: Boolean,
    formaPago: String,
    descuento: Number,
    domicilio: Number,
    iva: Number,
    total: Number,
    productos: String,
    prendas: String,
    // TODO estado?
  }, {
    timestamps: true
  });

  /**
   * Register the schema.
   */
  const Facturas = restful.model('Facturas', invoicesSchema);

  return Facturas;
};
