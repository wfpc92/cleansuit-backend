'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');
  require('mongoose-type-email');

  const VersionApp = mongoose.model('VersionApp')

  const configSchema = new mongoose.Schema({
    domicilio: {
      type: Number,
      required: true,
      default: 0
    },
    sobreEmpresa: {
      type: String,
      required: true,
      default: "Informacion sobre Empresa no editada"
    },
    terminosCondiciones: {
      type: String,
      required: true,
      default: "Terminos y condiciones no editadas"
    },
    empresa: {},
    factura: {}
  }, {
    timestamps: true
  });

  configSchema.methods.modificar = function(nuevaConfig) {
    this.domicilio = nuevaConfig.domicilio || this.domicilio;
    this.sobreEmpresa = nuevaConfig.sobreEmpresa || this.sobreEmpresa;
    this.terminosCondiciones = nuevaConfig.terminosCondiciones || this.terminosCondiciones;
    return this;
  };

  configSchema.post('save', function(next) {
    VersionApp.singleton(function(v) {
      v.configuraciones += 1;
    })
  });

  configSchema.post('findOneAndUpdate', function(next) {
    VersionApp.singleton(function(v) {
      v.configuraciones += 1;
    })
  });

  configSchema.statics.singleton = function(cb) {
    var self = this;
    self.find(function(err, configuracionesLst) {
      var configuraciones;

      if (configuracionesLst.length !== 0) {
        configuraciones = configuracionesLst[0];
        if (cb) {
          cb(configuraciones);
        }
      } else {
        configuraciones = new self();
        configuraciones.save(function(err) {
          if (cb) {
            cb(configuraciones);
          }
        });
      }
    });
  };

  /**
   * Register the schema.
   */
  const Config = restful.model('Configuraciones', configSchema);

  return Config;
};
