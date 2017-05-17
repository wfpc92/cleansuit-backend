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
  const Productos = mongoose.model('Productos');
  const Subservicios = mongoose.model('Subservicios');
  const VersionesOrdenes = mongoose.model('VersionesOrdenes');

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
    },
    noleido:  {
      type: Boolean,
      default: true
    },
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

  ordersSchema.methods.invoice = function(next) {
    next = next && typeof next === "function" ? next : null;

    mongoose.model('Ordenes').findOne({ _id: this._id }, function(err, order) {
      if (['rutaEntrega', 'entregada'].indexOf(order.estado) !== -1) {
        Facturas.findOne({ orden_id: order._id }, function(err, invoice) {
          if (err) return;

          var genInvoice = function(ord, inv) {
            Settings.findOne({}, {}, { sort: {'updatedAt': -1} }, function(err, config) {
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
                  var options = { format: 'Letter' };
                  pdf.create(html, options).toFile(`public/facturas/${ ord._id }.pdf`, function(err, res) {
                    if (err) return console.error(err);

                    return next ? next() : true;
                    // console.log(res); // { filename: '/app/businesscard.pdf' }
                  });
                  // fs.writeFile(`public/facturas/${ ord._id }.html`, html, function(err) {
                  //   if (err) return console.error(err);
                  //   // console.log("INVOICE SAVED!");
                  // });
                })
              })
            });
          }

          var saveInvoice = function(ord, inv) {
            Productos.find({}).sort({'createdAt': 1}).exec(function (err, prods) {
              if (err) return console.error(err);
              Subservicios.find({}).sort({'createdAt': 1}).exec(function (err, servs) {
                if (err) return console.error(err);

                // format the items for Excel
                let i, v, productos = {}, servicios = {};
                prods.forEach(function(pr) {
                  productos[pr._id] = {
                    nombre: pr.nombre,
                    count: 0
                  };
                });
                servs.forEach(function(sv) {
                  servicios[sv._id] = {
                    nombre: sv.nombre,
                    count: 0
                  };
                });
                if (ord.recoleccion.items.productos) {
                  for (i in ord.recoleccion.items.productos) {
                    v = ord.recoleccion.items.productos[i];
                    productos[v._id]['count'] += v.cantidad;
                  }
                }
                if (ord.recoleccion.items.prendas) {
                  for (i in ord.recoleccion.items.prendas) {
                    v = ord.recoleccion.items.prendas[i];
                    servicios[v.subservicio._id]['count'] += 1;
                  }
                }
                inv.productos = "";
                for (i in productos) {
                  v = productos[i];
                  inv.productos += `${v.count};${v.nombre};`;
                }
                inv.prendas = "";
                for (i in servicios) {
                  v = servicios[i];
                  inv.prendas += `${v.count};${v.nombre};`;
                }
                // save the invoice
                inv.save(function(err, invoice) {
                  if (err) return console.error(err);

                  genInvoice(ord, invoice);
                });
              })
            })
          }

          if (!invoice) {
            invoice = new Facturas({
              orden_id: order._id,
              cliente_id: order.cliente_id,
              domiciliario_recoleccion_id: order.domiciliario_recoleccion_id,
              domiciliario_entrega_id: order.domiciliario_entrega_id,
              servicioDirecto: order.orden.servicioDirecto,
              formaPago: order.orden.formaPago,
              descuento: order.orden.totales.descuento ? order.orden.totales.descuento : 0,
              domicilio: order.orden.totales.domicilio ? order.orden.totales.domicilio : 0,
              iva: order.orden.totales.impuestos ? order.orden.totales.impuestos : 0,
              total: order.orden.totales.total
            });
            saveInvoice(order, invoice);
          } else if (invoice.total != order.orden.totales.total) {
            invoice.descuento = order.orden.totales.descuento ? order.orden.totales.descuento : 0;
            invoice.domicilio = order.orden.totales.domicilio ? order.orden.totales.domicilio : 0;
            invoice.iva = order.orden.totales.impuestos ? order.orden.totales.impuestos : 0;
            invoice.total = order.orden.totales.total;
            saveInvoice(order, invoice);
          } else {
            fs.stat(`public/facturas/${ order._id }.pdf`, function(err, stat) {
              if (!err) {
                return next ? next() : true;
              } else {
                saveInvoice(order, invoice);
              }
            });
          }
        })
      } else {
        console.error('Estado inválido para facturar: ' + order.estado);
      }
    })
  };

  // update the invoice while it's not delivered
  ordersSchema.post('findOneAndUpdate', function(order) {
    VersionesOrdenes.actualizar(orden.cliente_id);
    order.invoice();
  });

  /**
   * Register the schema.
   */
  const Orders = restful.model('Ordenes', ordersSchema);

  Orders.route('invoice', {
    detail: true,
    handler: function (req, res, next) {
      Orders.findOne({ _id: req.params.id }, 'codigo', function(err, order) {
        let filename = `public/facturas/${ order._id }.pdf`;
        fs.stat(filename, function(err, stat) {
          if (!err) {
            res.download(filename, `Factura_${ order.codigo }.pdf`);
          } else {
            order.invoice(function() {
              res.download(filename, `Factura_${ order.codigo }.pdf`);
            });
          }
        });
      })
    }
  });

  Orders.route('count', {
    detail: false,
    handler: function (req, res, next) {
      let query = {},
          param = '';
      for (let p in req.query) {
        if (p.indexOf('__') !== -1) {
          param = p.split('__');
          query[param[0]] = {};
          query[param[0]][`\$${param[1]}`] = req.query[p];
        } else {
          query[p] = req.query[p];
        }
      }

      Orders.count(query, function(err, c) {
        return res.json({ count: c });
      });
    }
  });

  return Orders;
};
