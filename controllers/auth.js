'use strict';
(require('rootpath')());

var configs = require('config/configs');
var passport = configs.passport;

exports.checkLoggedIn = function(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

exports.localSignup = function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send(404, info.message); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.sendStatus(200);
    });
  })(req, res, next);
}

exports.localLogin = function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send(404, info.message); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.sendStatus(200);
    });
  })(req, res, next);
}

exports.logout = function(req, res, next) {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    req.logout();
    res.sendStatus(200);
  }
}