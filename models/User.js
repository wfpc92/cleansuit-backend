'use strict';

module.exports = (app) => {
  const bcrypt = require('bcrypt-nodejs');
  const crypto = require('crypto');
  const mongoose = require('mongoose');
  const restful = require('node-restful');
  const jwt = require('jwt-simple');
  require('mongoose-type-email');

  const ROLES = ['superadmin', 'gerente', 'admin_sede', 'trabajador', 'recepcionista', 'domiciliario', 'cliente'];

  const userSchema = new mongoose.Schema({
    nombre: String,
    correo: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
    },
    contrasena: {
      type: String
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

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
   * Password hash middleware.
   */
  userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('contrasena') && !user.isNew) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.contrasena, salt, null, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.contrasena = hash;
        next();
      });
    });
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
  const User = restful.model('User', userSchema);

  return User;
};
