'use strict';

module.exports = (app) => {
  const router = require('express').Router()
  const passport = require('passport');

  /**
   * OAuth authentication routes. (Sign in)
   */

  router.get(
    '/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['email', 'user_location']
    })
  );

  router.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/ingresar'
    }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/');
    }
  );

  router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: 'profile email'
    })
  );

  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/ingresar'
    }),
    (req, res) => {
      res.redirect(req.session.returnTo || '/');
    }
  );

  return router
};
