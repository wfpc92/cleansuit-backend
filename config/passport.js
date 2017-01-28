const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const JwtExtractor = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'contrasena'
}, (email, password, done) => {
  User.findOne({ correo: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Correo ${email} no encontrado.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Correo o contraseña no válidos.' });
    });
  });
}));

/**
 * Sign in using JWT token.
 */
passport.use(new JwtStrategy({
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: JwtExtractor.fromAuthHeader()
}, (jwt_payload, done) => {
  User.findOne({ _id: jwt_payload }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Usuario ${jwt_payload} no encontrado.` });
    }
    return done(null, user);
  });
}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Ya tiene una cuenta de Facebook enlazada. Inicie sesión con esa cuenta o bórrela, luego enlace esta otra cuenta.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.nombre = user.nombre || `${profile.name.givenName} ${profile.name.familyName}`;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.url_foto = user.profile.url_foto || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            req.flash('info', { msg: 'La cuenta de Facebook ha sido enlazada.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'Ya existe una cuenta usando este correo electrónico. Inicie sesión con esa cuenta y enlácela a Facebook manualmente desde su panel.' });
          done(err);
        } else {
          const user = new User();
          user.nombre = `${profile.name.givenName} ${profile.name.familyName}`;
          user.correo = profile._json.email;
          user.rol = 'cliente';
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.direccion = (profile._json.location) ? profile._json.location.name : '';
          user.profile.url_foto = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Sign in with Google.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Ya tiene una cuenta de Google enlazada. Inicie sesión con esa cuenta o bórrela, luego enlace esta otra cuenta.' });
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.nombre = user.nombre || profile.displayName;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.url_foto = user.profile.url_foto || profile._json.image.url;
          user.save((err) => {
            req.flash('info', { msg: 'La cuenta de Google ha sido enlazada.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'Ya hay una cuenta usando este correo electrónico. Inicie sesión con esa cuenta y enlacela con Google manualmente desde su panel.' });
          done(err);
        } else {
          const user = new User();
          user.nombre = profile.displayName;
          user.correo = profile.emails[0].value;
          user.rol = 'cliente';
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.url_foto = profile._json.image.url;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/ingresar');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
