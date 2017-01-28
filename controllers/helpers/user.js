'use strict';

module.exports = (app) => {
  const User = require('mongoose').model('User');

  return {
    regUser: (datos, callback) => {
      var nuevoUsuario = new User({
        'nombre': datos.nombre,
        'correo': datos.correo,
        'contrasena': datos.contrasena,
        'rol': datos.rol ? datos.rol : 'cliente',
        'profile': {
          'direccion': '',
          'telefono': '',
          'url_foto': datos.url_foto,
        }
      });

      nuevoUsuario.save((err) => {
        if (err) {
          console.log(err);
          return callback(null);
        }

        callback(nuevoUsuario.getInfo());
      });
    }
  }
}
