'use strict';

module.exports = (app) => {
  const router = require('express').Router()

  /**
   * GET /api/upload
   * File Upload API example.
   */

  router.get('/api/upload', (req, res) => {
    res.render('api/upload', {
      title: 'File Upload'
    });
  })

  router.post('/api/upload', app.locals.uploader.single('myFile'), (req, res) => {
    req.flash('success', {
      msg: 'File was uploaded successfully.'
    });
    res.redirect('/api/upload');
  })

  return router
};
