'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const TIPOS = ['compra', 'venta', 'ajuste'];

  const movesSchema = new mongoose.Schema({
    producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Productos'
    },
    tipo: {
      type: String,
      enum: TIPOS,
      required: true
    },
    cantidad: Number,
    ref: String,  // comentario
  }, {
    timestamps: true
  });

  /**
   * Register the schema.
   */
  movesSchema.statics.TIPOS = TIPOS;
  const ProduMoves = restful.model('ProduMoves', movesSchema);

  return ProduMoves;
};
