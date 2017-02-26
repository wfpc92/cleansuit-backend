/**
 * Module dependencies.
 */
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
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
const shortid = require('shortid');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      let folder = ''
      if (['promos', 'productos', 'servicios', 'usuarios'].indexOf(req.params.path) >= 0) {
        folder = `/${req.params.path}`
      }
      callback(null, `../cleansuit/public/images${folder}`);
    },
    filename: function(req, file, callback) {
      let filename = shortid.generate() + path.extname(file.originalname).toLowerCase()
      callback(null, filename);
    }
  })
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
  path: '.env.variables'
});

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
  app.use(methodOverride());
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
    console.log(req.route);
    if (req.path.indexOf('/upload/') === 0) {
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
      req.path !== '/ingresar' &&
      req.path !== '/registrar' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
      req.session.returnTo = req.path;
    } else if (req.user &&
      req.path == '/account') {
      req.session.returnTo = req.path;
    }
    next();
  });
  app.use(express.static(path.join(__dirname, 'public')/*, {
    maxAge: 31557600000
  }*/));
  app.use('/ng-admin', express.static(path.join(__dirname, 'node_modules/ng-admin/build')));

  /**
   * Development cors.
   */
  if (process.env.NODE_ENV == 'development') {
    app.use(cors())
  }

  /**
   * Load schemas and REST api.
   */
  require('./models')(app)

  /**
   * API keys and Passport configuration.
   */
  app.locals.auth = require('./config/passport');

  /**
   * Controllers (route handlers).
   */
  app.use(require('./controllers')(app));

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
  acl.addRoleParents('superadmin', 'gerente');
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
