'use strict';

module.exports = (app) => {
  const fs = require('fs');
  const pdf = require('html-pdf');
  const moment = require('moment');
  const numeral = require('numeral');
  const mongoose = require('mongoose');
  const autoIncrement = require('mongoose-auto-increment');
  const restful = require('node-restful');

  const Facturas = mongoose.model('Facturas');
  const Usuarios = mongoose.model('Usuarios');
  const Settings = mongoose.model('Configuraciones');

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

  // update the invoice while it's not delivered
  ordersSchema.post('findOneAndUpdate', function(order) {
    mongoose.model('Ordenes').findOne({ _id: order._id }, function(err, order) {
      if (order.estado == 'rutaEntrega') {
        Facturas.findOne({ orden_id: order._id }, function(err, invoice) {
          // console.log(err, invoice)
          if (err) return;

          var genInvoice = function(ord, inv) {
            Settings.findOne({}, {}, { sort: { 'updatedAt' : -1 } }, function(err, config) {
              // console.log( err, config );
              Usuarios.findOne({ _id: ord.cliente_id }, function(err, cliente) {
                var params = {
                  // vars
                  order: ord,
                  invoice: inv,
                  cliente: cliente,
                  config: config,
                  // libraries
                  moment: moment,
                  numeral: numeral,
                }
                app.render('invoice.html', params, function(err, html) {
                  // console.log(ord)
                  // console.log(err)
                  var options = { format: 'Letter' };
                  pdf.create(html, options).toFile(`public/facturas/${ ord._id }.pdf`, function(err, res) {
                    if (err) return console.log(err);
                    // console.log(res); // { filename: '/app/businesscard.pdf' }
                  });
                  // fs.writeFile(`public/facturas/${ ord._id }.html`, html, function(err) {
                  //   if (err) return console.log(err);
                  //   console.log("INVOICE SAVED!");
                  // });
                })
              })
            });
          }

          if (!invoice) {
            invoice = new Facturas({
              orden_id: order._id,
              cliente_id: order.cliente_id,
              domiciliario_recoleccion_id: order.domiciliario_recoleccion_id,
              domiciliario_entrega_id: order.domiciliario_entrega_id,
              servicioDirecto: order.orden.servicioDirecto,
              formaPago: order.orden.formaPago,
              descuento: order.orden.totales.descuento,
              domicilio: order.orden.totales.domicilio,
              iva: order.orden.totales.impuestos,
              total: order.orden.totales.total
            });
            invoice.save();
            invoice.updatedAt = new Date();
            genInvoice(order, invoice);
          } else if (invoice.total != order.orden.totales.total) {
            invoice.total = order.orden.totales.total;
            invoice.save();
            genInvoice(order, invoice);
          }
        })
      }
    })
  });

  /**
   * Register the schema.
   */
  const Orders = restful.model('Ordenes', ordersSchema);

  Orders.route('invoice', {
    detail: true,
    handler: function (req, res, next) {
      Orders.findOne({ _id: req.params.id }, 'codigo', function(err, order) {
        res.download(`public/facturas/${ order._id }.pdf`, `Factura_${ order.codigo }.pdf`, function(err) {
          if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
          } else {
          }
        });
      })
    }
  })

  return Orders;
};
