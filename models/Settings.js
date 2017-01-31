'use strict';

module.exports = (app) => {
  const mongoose = require('mongoose');
  const restful = require('node-restful');
  require('mongoose-type-email');

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
    }
  }, {
    timestamps: true
  });

  configSchema.methods.modificar = function(nuevaConfig) {
    this.domicilio = nuevaConfig.domicilio || this.domicilio;
    this.sobreEmpresa = nuevaConfig.sobreEmpresa || this.sobreEmpresa;
    this.terminosCondiciones = nuevaConfig.terminosCondiciones || this.terminosCondiciones;
    return this;
  };

  /**
   * Register the schema.
   */
  const Config = restful.model('Configuraciones', configSchema);

  return Config;
};
