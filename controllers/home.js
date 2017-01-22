'use strict';

module.exports = (app) => {
  return {

    /**
     * GET /
     * Home page.
     */
    index: (req, res) => {
      res.render('home', {
        title: 'Home'
      });
    },

  };
};
