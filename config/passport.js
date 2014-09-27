'use strict';
require('rootpath')();

var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var bcrypt = require('bcryptjs');
var User = require('models/Users');

function localLoginVerifyCallback(email, password, done) {
  User.one(
    {email: email}, 
    function(err, result) {
      if (err) { return done(err); }
      if (!result || !result.validPassword(password)) { 
        return done(null, false, {message: 'invalid email and password combination'});
      }
      return done(null, result);
    });
}

function localSignupVerifyCallback(req, email, password, done) {
  async.waterfall(
  [
    function(callback) {
      User.one({email: email}, function(err, user) {
        if (user) { return done(null, false, {message: 'email already taken'}); }
        callback(null);
      });
    },
    function(callback) {
      User.create(req.body.firstName, req.body.lastName, email, password, callback);
    },
    function(callback) {
      User.one({email: email}, callback);
    }
  ],
  function(err, result) {
    if (err) { return done(err); }
    done(null, result);
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
