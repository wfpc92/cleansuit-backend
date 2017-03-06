'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const invoicesSchema = new mongoose.Schema({
    orden_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ordenes'
    },
    total: Number,
  }, {
    timestamps: true
  });

  /**
   * Register the schema.
   */
  const Facturas = restful.model('Facturas', invoicesSchema);

  return Facturas;
};
