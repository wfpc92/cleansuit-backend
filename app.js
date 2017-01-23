/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({
  dest: path.join(__dirname, 'uploads')
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: '.env.variables'
});

/**
 * API keys and Passport configuration.
 */
const authConfig = require('./config/passport');

/**
 * Role handler.
 */
var acl = require('acl');

/**
 * Create Express server.
 */
const app = express();

/**
 * Run the app after MongoDB.
 */
function runapp() {
  /**
   * ACL configuration.
   */
  acl = new acl(new acl.mongodbBackend(mongoose.connection, {
    debug: (msg) => console.log('  ACL debug: ', msg)
  }));

  /**
   * Assign app local vars.
   */
  app.locals.acl = acl;
  app.locals.auth = authConfig;
  app.locals.uploader = upload;

  /**
   * Express configuration.
   */
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');
  app.use(expressStatusMonitor());
  app.use(compression());
  app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
  }));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressValidator());
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use((req, res, next) => {
    if (req.path === '/api/upload') {
      next();
    } else {
      lusca.csrf()(req, res, next);
    }
  });
  app.use(lusca.xframe('SAMEORIGIN'));
  app.use(lusca.xssProtection(true));
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
  });
  app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
      req.session.returnTo = req.path;
    } else if (req.user &&
      req.path == '/account') {
      req.session.returnTo = req.path;
    }
    next();
  });
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
  }));

  /**
   * Controllers (route handlers).
   */
  app.use(require('./controllers')(app))
  const userCtrl = require('./controllers/user')(app);

  /**
   * Primary app routes.
   */
  app.get('/login', userCtrl.getLogin);
  app.post('/login', userCtrl.postLogin);
  app.get('/logout', userCtrl.logout);
  app.get('/forgot', userCtrl.getForgot);
  app.post('/forgot', userCtrl.postForgot);
  app.get('/reset/:token', userCtrl.getReset);
  app.post('/reset/:token', userCtrl.postReset);
  app.get('/signup', userCtrl.getSignup);
  app.post('/signup', userCtrl.postSignup);
  app.get('/account', authConfig.isAuthenticated, userCtrl.getAccount);
  app.post('/account/profile', authConfig.isAuthenticated, userCtrl.postUpdateProfile);
  app.post('/account/password', authConfig.isAuthenticated, userCtrl.postUpdatePassword);
  app.post('/account/delete', authConfig.isAuthenticated, userCtrl.postDeleteAccount);
  app.get('/account/unlink/:provider', authConfig.isAuthenticated, userCtrl.getOauthUnlink);

  /**
   * Error Handler.
   */
  app.use(errorHandler());

  /**
   * Roles setup.
   */
  acl.allow([{
      roles: 'superadmin',
      allows: [
        // { resources: '*', permissions: '*' }
      ]
    },
    {
      roles: 'gerente',
      allows: []
    },
    {
      roles: 'admin_sede',
      allows: []
    },
    {
      roles: 'recepcionista',
      allows: []
    },
    {
      roles: 'trabajador',
      allows: []
    },
    {
      roles: 'recepcionista',
      allows: []
    },
    {
      roles: 'domiciliario',
      allows: []
    },
    {
      roles: 'cliente',
      allows: []
    },
    {
      roles: 'guest',
      allows: []
    }
  ]);
  acl.addRoleParents('root', 'gerente');
  acl.addRoleParents('gerente', 'admin_sede');
  // acl.addRoleParents('cliente', 'guest');

  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
}

/**
 * Connect to MongoDB.
 */
require('./config/database')(mongoose, runapp);

module.exports = app;
