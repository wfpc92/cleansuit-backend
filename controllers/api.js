'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  /**
   * POST /upload/:path
   * Centralized File Upload API.
   */
  router.post('/upload/:path', app.locals.uploader.any(), (req, res) => {
    res.json({
      'uploaded_url': req.files[0].path.replace('../cleansuit/public', 'http://api.cleansuit.co')
    })
  })

  return router
};
