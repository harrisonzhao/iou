'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.redirect('/login');
}

exports.localSignup = passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
});

exports.localLogin = passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login')
  } else {
    req.logout();
    res.redirect('/');
  }
}