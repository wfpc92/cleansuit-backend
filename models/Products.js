'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');

  const productsSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    desc_corta: String,
    desc_larga: String,
    url_imagen: String,
    stock: Number,
  });

  /**
   * Register the schema.
   */
  const Products = restful.model('Productos', productsSchema);

  return Products;
};
