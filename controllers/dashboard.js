'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  /**
   * GET /panel
   * User dashboard page.
   */
  router.get('/panel', (req, res) => {
    res.render('dashboard/index', {
      title: 'Panel'
    });
  })

  return router
};
