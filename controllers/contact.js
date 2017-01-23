'use strict';

module.exports = (app) => {
  const router = require('express').Router()
  const nodemailer = require('nodemailer')
  const xoauth2 = require('xoauth2')

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        refreshToken: process.env.GOOGLE_RTOKEN,
        accessToken: process.env.GOOGLE_ATOKEN
      })
    }
  })

  /**
   * GET /contact
   * Contact form page.
   */
  router.get('/contact', (req, res) => {
    res.render('contact', {
      title: 'Contact'
    });
  })

  /**
   * POST /contact
   * Send a contact form via Nodemailer.
   */
  router.post('/contact', (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/contact');
    }

    const mailOptions = {
      to: 'your@email.com',
      from: `${req.body.name} <${req.body.email}>`,
      subject: 'Contact Form | Hackathon Starter',
      text: req.body.message
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        req.flash('errors', { msg: err.message });
        return res.redirect('/contact');
      }
      req.flash('success', { msg: 'Email has been sent successfully!' });
      res.redirect('/contact');
    });
  })

  return router
}
