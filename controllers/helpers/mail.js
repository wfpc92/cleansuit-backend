'use strict';

module.exports = (app) => {
  const nodemailer = require('nodemailer');
  const sendmail = require('nodemailer-sendmail-transport');

  return {
    // @HELPER Envía un correo automatizado con el texto
    // Invoca el callback al terminar con error=null en caso de éxito
    // El correo se envía mediante el SendMail de WebFaction (https://docs.webfaction.com/user-guide/email.html#email-sending-from-an-application)
    sendMail: (origen, destino, titulo, texto, html, callback) => {
      var opciones = {
        'from': origen,
        'to': destino,
        'subject': titulo,
        'text': texto,
        'html': html
      };

      var transporter = nodemailer.createTransport(sendmail({
        path: '/usr/bin/sendmail',
        args: ''
      }));
      transporter.sendMail(opciones, function(error, info) {
        callback(error, info);
      });
    }
  }
}
