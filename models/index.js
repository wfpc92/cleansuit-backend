'use strict';

module.exports = (app) => {
  const bcrypt = require('bcrypt-nodejs');
  const mongoose = require('mongoose');

  const VersionApp = require('./VersionApp')(app)
  const User = require('./User')(app)
  const Settings = require('./Settings')(app)
  const Facturas = require('./Invoices')(app)
  const Orders = require('./Orders')(app)
  const Products = require('./Products')(app)
  const ProduMoves = require('./ProduMoves')(app)
  const Promos = require('./Promos')(app)
  const Services = require('./Services')(app)
  const Subservices = require('./Subservices')(app)

  // roles updater
  const updateRoles = function(req, res, next) {
    const user = res.locals.bundle;
    const uid = `${user._id}`;
    app.locals.acl.userRoles(uid, function(err, roles) {
      if (roles) app.locals.acl.removeUserRoles(uid, roles, function(err) {})
      app.locals.acl.addUserRoles(uid, user.rol, function(err) {})
    });
    next();
  }

  // password hash middleware.
  const hashPassword = function(req, res, next) {
    mongoose.model('Usuarios').findOne({ correo: req.body.correo }, function (err, user) {
      var isNew = !user,
          isModified = (user && user.contrasena != req.body.contrasena);
      if (isModified && typeof req.body.contrasena != 'undefined' || isNew) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return next(err);
          }
          bcrypt.hash(req.body.contrasena, salt, null, (err, hash) => {
            if (err) {
              return next(err);
            }
            req.body.contrasena = hash;
            next();
          });
        });
      } else {
        next();
      }
    });
  }


  /**
   * RESTful routes.
   */
  Facturas.methods(['get'])
  Facturas.register(app, '/rest/facturas')

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

  Settings.methods(['get', 'put'])
  Settings.register(app, '/rest/settings')

  User.methods(['get', 'post', 'put', 'delete'])
  User.before('post', hashPassword);
  User.before('put', hashPassword);
  User.after('post', updateRoles);
  User.after('put', updateRoles);
  User.register(app, '/rest/usuarios')
}
