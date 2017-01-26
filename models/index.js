'use strict';

module.exports = (app) => {
  const User = require('./User')(app)

  User.methods(['get', 'post', 'put', 'delete'])
  User.register(app, '/rest/usuarios')
}
