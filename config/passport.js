'use strict';
require('rootpath')();

//OAuth strategy dependencies
var LocalStrategy = require('passport-local').Strategy;
//load up the user model
//need a way to get the Id??? either that or store by email in db
var User = require('models/User');
var async = require('async');

function localLoginVerifyCallback(email, password, done) {
  User.selectByEmail(email, function(err, result) {
    if (err) {
      return done(err);
    }
    if (!result || !User.utils.isValidPassword(password, result.password)) {
      return done(
        null, 
        false, 
        { message: 'Invalid email and password combination.' });
    }
    done(null, result);
  });
}

function localSignupVerifyCallback(email, password, done) {
  var checkEmailTaken = function(callback) {
    User.selectByEmail(email, function(err, result) {
      if (err) { return callback(err); }
      if (result) {
        return done(null, false, {message: 'That email is already taken.'});
      }
      callback(null);
    });
  };

  var createNewUser = function(callback) {
    User.insert(email, password, function(err) {
      err ? callback(err) : callback(null);
    });
  };

  //must serialize user by getting full user (including id)
  var serializeUser = function(callback) {
    User.selectByEmail(email, function(err, result) {
      err ? callback(err) : callback(null, result);
    });
  }

  async.waterfall(
    [
      checkEmailTaken, 
      createNewUser, 
      serializeUser
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
    passwordField: 'password'
  },
  localSignupVerifyCallback));

};       
