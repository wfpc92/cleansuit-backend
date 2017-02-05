'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const autoIncrement = require('mongoose-auto-increment');
  const restful = require('node-restful');

  const ESTADOS = [
    'nueva', //0
    'rutaRecoleccion', //1
    'recolectada', //2
    'procesando', //3
    'rutaEntrega', //4
    'entregada', //5
    'cancelada' //6
  ];

  const ordersSchema = new mongoose.Schema({
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
    codigo: {
      type: Number
    },
    fecha: {
      type: Date
    },
    estado: {
      type: String,
      enum: ESTADOS
    },
    total: { // total facturado
      type: Number
    },
    orden: {},
    items: {},
    recoleccion: {},
    entrega: {},
    cancelacion: {},
    servicioDirecto: {
      type: Boolean
    }
  });

  ordersSchema.plugin(autoIncrement.plugin, {
    model: 'Ordenes',
    field: 'codigo',
    startAt: 1,
    incrementBy: 1
  });

  ordersSchema.statics.ESTADOS = ESTADOS;

  ordersSchema.statics.ESTADOSENPROCESO = [
    ESTADOS[0], //nueva
    ESTADOS[1], //rutaRecoleccion
    ESTADOS[2], //recolectada
    ESTADOS[3], //procesando
    ESTADOS[4], //rutaEntrega
  ];

  ordersSchema.statics.ESTADORUTARECOLECCION = [
    ESTADOS[1], //rutaRecoleccion
  ];

  ordersSchema.statics.ESTADORECOLECTADA = [
    ESTADOS[2], //rutaEntrega
  ];

  ordersSchema.statics.ESTADORUTAENTREGA = [
    ESTADOS[4], //rutaEntrega
  ];

  ordersSchema.statics.ESTADOENTREGADA = [
    ESTADOS[5], //rutaEntrega
  ];

  ordersSchema.statics.ESTADOCANCELADA = [
    ESTADOS[6], //cancelada
  ];

  /**
   * Register the schema.
   */
  const Orders = restful.model('Ordenes', ordersSchema);

  return Orders;
};
