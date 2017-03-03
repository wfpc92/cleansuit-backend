'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const promosSchema = new mongoose.Schema({
    codigo: {
      type: String,
      unique: true,
      required: true
    },
    fecha_inicio: {
      type: Date,
      required: true
    },
    fecha_fin: {
      type: Date,
      required: true
    },
    descripcion: {
      type: String
    },
    url_imagen: {
      type: String
    },
    etiquetaDescuentos: {
      type: String
    },
    // referencias a los productos y subservicios a los se aplica la promocion.
    productos: [],
    servicios: [],
  });

  promosSchema.methods.vigente = function() {
    var ahora = Date.now();
    // console.log(ahora, this.fecha_inicio, this.fecha_fin);
    return ahora >= this.fecha_inicio && ahora <= this.fecha_fin;
  };

  promosSchema.methods.etiquetar = function() {
    var arr = [], etiqueta, cadena;

    for (var i in this.items) {
      if (this.items &&
        arr.indexOf(this.items[i].descuento) == -1 &&
        this.items[i].descuento) {
        arr.push(parseInt(this.items[i].descuento));
      }
    }

    arr = arr.sort(function(a, b) {
      return a - b
    });

    if (arr.length === 0) {
      etiqueta = "Descuento del " + this.descuento + "%";
    } else if (arr.length == 1) {
      etiqueta = "Descuento del " + arr[0] + "%";
    } else {
      cadena = "";
      for (i in arr) {
        cadena += arr[i];
        if (i < arr.length - 2) {
          cadena += ", ";
        }
        if (i == arr.length - 2) {
          cadena += " y "
        }
      }

      etiqueta = `Descuentos del ${cadena}%`;
    }
    // console.log(etiqueta)
    this.etiquetaDescuentos = etiqueta;
  };

  /**
   * Register the schema.
   */
  const Promos = restful.model('Promociones', promosSchema);

  return Promos;
};
