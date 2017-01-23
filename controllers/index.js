'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  router.use(require('./auth')(app))
  router.use(require('./user')(app))
  router.use(require('./pages')(app))
  router.use(require('./contact')(app))
  router.use(require('./api')(app))

  return router
}
