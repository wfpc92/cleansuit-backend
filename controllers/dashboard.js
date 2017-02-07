'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  /**
   * GET /panel
   * User dashboard page.
   */
  // TODO make authentication required
  router.get('/', (req, res) => {
    res.render('dashboard/index', {
      title: 'Panel'
    });
  })

  return router
};
