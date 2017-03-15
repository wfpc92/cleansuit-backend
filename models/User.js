'use strict';

module.exports = (app) => {
  const bcrypt = require('bcrypt-nodejs');
  const crypto = require('crypto');
  const mongoose = require('mongoose');
  const restful = require('node-restful');
  const jwt = require('jwt-simple');
  require('mongoose-type-email');

  const ROLES = ['superadmin', 'gerente', 'admin_sede', 'recepcionista', 'trabajador', 'domiciliario', 'cliente'];

  const userSchema = new mongoose.Schema({
    nombre: String,
    correo: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
    },
    contrasena: {
      type: String
    },
    pass_token: String,
    pass_token_vence: Date,

    rol: {
      type: String,
      enum: ROLES,
      required: true
    },

    facebook: String,
    google: String,
    tokens: Array,

    profile: {
      direccion: String,
      telefono: String,
      url_foto: String,
    }
  }, {
    timestamps: true
  });

  /**
   * Helper method for validating user's password.
   */
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.contrasena, (err, isMatch) => {
      cb(err, isMatch);
    });
  };

  /**
   * Helper method for getting user's gravatar.
   */
  userSchema.methods.gravatar = function(size) {
    if (!size) {
      size = 200;
    }
    if (!this.correo) {
      return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.correo).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  };

  /**
   * Helper to format the login info.
   */
  userSchema.methods.getInfo = function() {
    var token = jwt.encode(this._id, process.env.JWT_SECRET);

    return {
      nombre: this.nombre,
      correo: this.correo,
      rol: this.rol,
      token: `JWT ${token}`,
      fb: this.facebook ? true : false,
      direccion: this.profile.direccion ? this.profile.direccion : '',
      telefono: this.profile.telefono ? this.profile.telefono : '',
      url_foto: this.profile.url_foto ? this.profile.url_foto : '',
    };
  };

  /**
   * Register the roles and schema.
   */
  userSchema.statics.ROLES = ROLES;
  const User = restful.model('Usuarios', userSchema);

  User.route('count', {
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

      User.count(query, function(err, c) {
        return res.json({ count: c });
      });
    }
  });

  return User;
};
