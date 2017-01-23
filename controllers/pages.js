'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  /**
   * GET /
   * Home page.
   */
  router.get('/', (req, res) => {
    res.render('home', {
      title: 'Home'
    });
  })

  return router
};
