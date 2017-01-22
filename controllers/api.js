'use strict';

module.exports = (app) => {
  return {

    /**
     * GET /api/upload
     * File Upload API example.
     */

    getFileUpload: (req, res) => {
      res.render('api/upload', {
        title: 'File Upload'
      });
    },

    postFileUpload: (req, res) => {
      req.flash('success', { msg: 'File was uploaded successfully.' });
      res.redirect('/api/upload');
    },

  };
};
