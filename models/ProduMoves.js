'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const Productos = mongoose.model('Productos');

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

  movesSchema.post('save', function() {
    var move = this;
    Productos.findOne({ '_id': move.producto_id }, function (err, product) {
      if (!product.stock) {
        product.stock = 0;
      }
      if (product) {
        switch (move.tipo) {
          case 'ajuste':
            product.stock = move.cantidad;
            break;
          case 'compra':
            product.stock += move.cantidad;
            break;
          case 'venta':
            product.stock -= move.cantidad;
            break;
        }
        product.save();
      }
    })
  });

  movesSchema.post('findOneAndRemove', function(move) {
    Productos.findOne({ '_id': move.producto_id }, function (err, product) {
      if (product) {
        switch (move.tipo) {
          case 'ajuste':
            break;
          case 'compra':
            product.stock -= move.cantidad;
            break;
          case 'venta':
            product.stock += move.cantidad;
            break;
        }
        product.save();
      }
    })
  });

  /**
   * Register the schema.
   */
  movesSchema.statics.TIPOS = TIPOS;
  const ProduMoves = restful.model('ProduMoves', movesSchema);

  return ProduMoves;
};
