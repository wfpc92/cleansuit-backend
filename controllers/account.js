'use strict';

module.exports = (app) => {
  const router = require('express').Router();
  const async = require('async');
  const crypto = require('crypto');
  const nodemailer = require('nodemailer');
  const passport = require('passport');
  const User = require('mongoose').model('Usuarios');

  /**
   * GET /session
   * User session info.
   */
  router.get('/session', app.locals.auth.isAuthenticated, (req, res) => {
    res.json({
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol,
    })
  })

  /**
   * GET /ingresar
   * Login page.
   */
  router.get('/ingresar', (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/login', {
      title: 'Iniciar Sesión'
    });
  })

  /**
   * POST /ingresar
   * Sign in using email and password.
   */
  router.post('/ingresar', (req, res, next) => {
    req.assert('correo', 'Correo electrónico no válido').isEmail();
    req.assert('contrasena', 'Debe proporcionar una contraseña').notEmpty();
    req.sanitize('correo').normalizeEmail({
      remove_dots: false
    });

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.format({
        html: () => res.redirect('/ingresar'),
        json: () => res.json({
          success: false,
          mensaje: errors[0].msg,
          error: errors
        }),
      });
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', info);
        return res.format({
          html: () => res.redirect('/ingresar'),
          json: () => res.json({
            success: false,
            mensaje: info.msg
          }),
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', {
          msg: 'Has iniciado sesión exitosamente!'
        });
        res.redirect('/');
      });
    })(req, res, next);
  })

  /**
   * GET /salir
   * Log out.
   */
  router.get('/salir', (req, res) => {
    req.logout();
    res.redirect('/');
  })

  /**
   * GET /registrar
   * Signup page.
   */
  // router.get('/registrar', (req, res) => {
  //   if (req.user) {
  //     return res.redirect('/');
  //   }
  //   res.render('account/signup', {
  //     title: 'Registrarse'
  //   });
  // })

  /**
   * POST /registrar
   * Create a new local account.
   */
  // router.post('/registrar', (req, res, next) => {
  //   req.assert('correo', 'Correo electrónico no válido').isEmail();
  //   req.assert('contrasena', 'La contraseña debe ser de por lo menos 4 caracteres').len(4);
  //   if (req.body.confirmarContrasena)
  //     req.assert('confirmarContrasena', 'Las contraseñas no coinciden').equals(req.body.contrasena);
  //   req.sanitize('correo').normalizeEmail({
  //     remove_dots: false
  //   });
  //
  //   const errors = req.validationErrors();
  //
  //   if (errors) {
  //     req.flash('errors', errors);
  //
  //     return res.format({
  //       json: () => res.json({
  //         success: false,
  //         mensaje: 'Por favor ingrese nombre, correo y contraseña.'
  //       }),
  //       default: () => res.redirect('/registrar')
  //     });
  //   }
  //
  //   const user = new User({
  //     correo: req.body.correo,
  //     contrasena: req.body.contrasena
  //   });
  //
  //   User.findOne({
  //     correo: req.body.correo
  //   }, (err, existingUser) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     if (existingUser) {
  //       req.flash('errors', {
  //         msg: 'Ya existe una cuenta con ese correo electrónico.'
  //       });
  //       return res.redirect('/registrar');
  //     }
  //     user.save((err) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       req.logIn(user, (err) => {
  //         if (err) {
  //           return next(err);
  //         }
  //         res.redirect('/');
  //       });
  //     });
  //   });
  // })

  /**
   * GET /account
   * Profile page.
   */
  // router.get('/account', app.locals.auth.isAuthenticated, (req, res) => {
  //   res.render('account/profile', {
  //     title: 'Account Management'
  //   });
  // })

  /**
   * POST /account/profile
   * Update profile information.
   */
  // router.post('/account/profile', app.locals.auth.isAuthenticated, (req, res, next) => {
  //   req.assert('email', 'Please enter a valid email address.').isEmail();
  //   req.sanitize('email').normalizeEmail({
  //     remove_dots: false
  //   });
  //
  //   const errors = req.validationErrors();
  //
  //   if (errors) {
  //     req.flash('errors', errors);
  //     return res.redirect('/account');
  //   }
  //
  //   User.findById(req.user.id, (err, user) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     user.correo = req.body.email || '';
  //     user.nombre = req.body.name || '';
  //     user.profile.gender = req.body.gender || '';
  //     user.profile.direccion = req.body.location || '';
  //     user.profile.website = req.body.website || '';
  //     user.save((err) => {
  //       if (err) {
  //         if (err.code === 11000) {
  //           req.flash('errors', {
  //             msg: 'The email address you have entered is already associated with an account.'
  //           });
  //           return res.redirect('/account');
  //         }
  //         return next(err);
  //       }
  //       req.flash('success', {
  //         msg: 'Profile information has been updated.'
  //       });
  //       res.redirect('/account');
  //     });
  //   });
  // })

  /**
   * POST /account/password
   * Update current password.
   */
  // router.post('/account/password', app.locals.auth.isAuthenticated, (req, res, next) => {
  //   req.assert('password', 'Password must be at least 4 characters long').len(4);
  //   req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  //
  //   const errors = req.validationErrors();
  //
  //   if (errors) {
  //     req.flash('errors', errors);
  //     return res.redirect('/account');
  //   }
  //
  //   User.findById(req.user.id, (err, user) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     user.password = req.body.password;
  //     user.save((err) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       req.flash('success', {
  //         msg: 'Password has been changed.'
  //       });
  //       res.redirect('/account');
  //     });
  //   });
  // })

  /**
   * POST /account/delete
   * Delete user account.
   */
  // router.post('/account/delete', app.locals.auth.isAuthenticated, (req, res, next) => {
  //   User.remove({
  //     _id: req.user.id
  //   }, (err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     req.logout();
  //     req.flash('info', {
  //       msg: 'Your account has been deleted.'
  //     });
  //     res.redirect('/');
  //   });
  // })

  /**
   * GET /account/unlink/:provider
   * Unlink OAuth provider.
   */
  // router.get('/account/unlink/:provider', app.locals.auth.isAuthenticated, (req, res, next) => {
  //   const provider = req.params.provider;
  //   User.findById(req.user.id, (err, user) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     user[provider] = undefined;
  //     user.tokens = user.tokens.filter(token => token.kind !== provider);
  //     user.save((err) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       req.flash('info', {
  //         msg: `${provider} account has been unlinked.`
  //       });
  //       res.redirect('/account');
  //     });
  //   });
  // })

  /**
   * GET /reset/:token
   * Reset Password page.
   */
  router.get('/reset/:token', (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    User
      .findOne({
        pass_token: req.params.token
      })
      .where('pass_token_vence').gt(Date.now())
      .exec((err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          req.flash('errors', {
            msg: 'La solicitud de restablecimiento no es válida o ha expirado.'
          });
          return res.redirect('/forgot');
        }
        res.render('account/reset', {
          title: 'Restablecimiento de Contraseña'
        });
      });
  })

  /**
   * POST /reset/:token
   * Process the reset password request.
   */
  router.post('/reset/:token', (req, res, next) => {
    req.assert('password', 'La contraseña debe tener mínimo 6 caracteres.').len(6);
    req.assert('confirm', 'Las contraseñas deben coincidir.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('back');
    }

    async.waterfall([
      function resetPassword(done) {
        User
          .findOne({
            pass_token: req.params.token
          })
          .where('pass_token_vence').gt(Date.now())
          .exec((err, user) => {
            if (err) {
              return next(err);
            }
            if (!user) {
              req.flash('errors', {
                msg: 'La solicitud de restablecimiento no es válida o ha expirado.'
              });
              return res.redirect('back');
            }
            user.contrasena = req.body.password;
            user.pass_token = undefined;
            user.pass_token_vence = undefined;
            user.save((err) => {
              if (err) {
                return next(err);
              }
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          });
      },
      function sendResetPasswordEmail(user, done) {
        const transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
        const mailOptions = {
          to: user.correo,
          from: 'ventas@cleansuit.co',
          subject: 'Su contraseña ha sido cambiada',
          text: `Hola,\n\nEsta es una confirmación de que la contraseña de su cuenta ${user.correo} ha sido cambiada.\n`
        };
        transporter.sendMail(mailOptions, (err) => {
          req.flash('success', {
            msg: 'Listo! Su contraseña ha sido restablecida.'
          });
          done(err);
        });
      }
    ], (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  })

  /**
   * GET /forgot
   * Forgot Password page.
   */
  router.get('/forgot', (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.render('account/forgot', {
      title: 'Contraseña Olvidada'
    });
  })

  /**
   * POST /forgot
   * Create a random token, then the send user an email with a reset link.
   */
  router.post('/forgot', (req, res, next) => {
    req.assert('email', 'Por favor proporcione un correo electrónico válido.').isEmail();
    req.sanitize('email').normalizeEmail({
      remove_dots: false
    });

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/forgot');
    }

    async.waterfall([
      function createRandomToken(done) {
        crypto.randomBytes(16, (err, buf) => {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      function setRandomToken(token, done) {
        User.findOne({
          correo: req.body.email
        }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            req.flash('errors', {
              msg: 'No existe una cuenta con ese correo electrónico.'
            });
            return res.redirect('/forgot');
          }
          user.pass_token = token;
          user.pass_token_vence = Date.now() + 3600000; // 1 hour
          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      function sendForgotPasswordEmail(token, user, done) {
        const transporter = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
        const mailOptions = {
          to: user.correo,
          from: 'ventas@cleansuit.co',
          subject: 'Reestablecer Contraseña Cleansuit.co',
          text: `Usted está recibiendo este correo porque se ha solicitado el restablecimiento de la contraseña de su cuenta.\n\n
            Por favor, siga el siguiente enlace o péguelo en su navegador para completar el proceso:\n\n
            http://${req.headers.host}/reset/${token}\n\n
            Si usted no hizo esta solicitud, por favor ignore este correo y su contraseña permanecerá igual.\n`
        };
        transporter.sendMail(mailOptions, (err) => {
          req.flash('info', {
            msg: `Un correo con instrucciones ha sido enviado al correo ${user.correo}.`
          });
          done(err);
        });
      }
    ], (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/forgot');
    });
  })

  return router
};
