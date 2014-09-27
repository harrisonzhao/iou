'use strict';
require('rootpath')();

var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var User = require('models/User');

function localLoginVerifyCallback(email, password, done) {
  User.one(
    {email: email}, 
    function(err, result) {
      if (err) { return done(err); }
      if (!result || !result.validPassword(password)) { 
        return done(null, false, { message: 'Invalid email and password combination' });
      }
      return done(null, result);
    });
}

function localSignupVerifyCallback(req, email, password, done) {
  async.waterfall(
  [
  ],
  function(err, result) {

  });
  User.one(
    {email: email}, 
    function(err, result) {
      if (err) { return done(err); }
      if (result) { 
        return done(null, false, { message: 'Email already exists' });
      }
      var user = {};
      user.email = email;
      user.first_name = req.body.firstName;
      user.last_name = req.body.last_name;
      user.password = password;
      user.is_admin = false;
      User.create(user, function(err, result) {
        if (err) { return done(err); }

      })
    });
}


module.exports = function(passport) {
  /* Passport needs ability to serialize and deserialize users out of session */

  // Serialize the user for the session
  passport.serializeUser(function(user, done) { done(null, user.userId); });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    User.selectById(id, function(err, user) { done(err, user); });
  });

  // Local login strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  localLoginVerifyCallback));

  // Local signup strategy
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  localSignupVerifyCallback));

};       
