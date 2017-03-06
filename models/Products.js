'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const VersionApp = mongoose.model('VersionApp')

  const productsSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    desc_corta: String,
    desc_larga: String,
    url_imagen: String,
    stock: Number,
  });

  productsSchema.post('save', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  productsSchema.post('findOneAndUpdate', function(next) {
    VersionApp.singleton(function(v) {
      v.inventario += 1;
    })
  });

  /**
   * Register the schema.
   */
  const Products = restful.model('Productos', productsSchema);

  return Products;
};
