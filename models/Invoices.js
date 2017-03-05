'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const invoicesSchema = new mongoose.Schema({
    filename: String,
    orden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordenes'
    },
  }, {
    timestamps: true
  });

  /**
   * Register the schema.
   */
  const Facturas = restful.model('Facturas', invoicesSchema);

  return Facturas;
};
