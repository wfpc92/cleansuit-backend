'use strict';

module.exports = (app) => {
  const Orders = require('./Orders')(app)
  const Products = require('./Products')(app)
  const ProduMoves = require('./ProduMoves')(app)
  const Promos = require('./Promos')(app)
  const Services = require('./Services')(app)
  const Subservices = require('./Subservices')(app)
  const User = require('./User')(app)

  /**
   * RESTful routes.
   */
  Orders.methods(['get', 'post', 'put', 'delete'])
  Orders.register(app, '/rest/ordenes')

  Products.methods(['get', 'post', 'put', 'delete'])
  Products.register(app, '/rest/productos')

  ProduMoves.methods(['get', 'post', 'put', 'delete'])
  ProduMoves.register(app, '/rest/produmoves')

  Promos.methods(['get', 'post', 'put', 'delete'])
  Promos.register(app, '/rest/promociones')

  Services.methods(['get', 'post', 'put', 'delete'])
  Services.register(app, '/rest/servicios')

  Subservices.methods(['get', 'post', 'put', 'delete'])
  Subservices.register(app, '/rest/subservicios')

  User.methods(['get', 'post', 'put', 'delete'])
  User.register(app, '/rest/usuarios')
}
