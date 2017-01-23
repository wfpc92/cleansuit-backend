'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  router.use(require('./pages')(app))
  router.use(require('./contact')(app))

  return router
}
