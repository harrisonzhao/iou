'use strict';

exports.renderIndex = function(req, res) {
  req.user ? 
    res.redirect('/profile') :
    res.render('index');
}

exports.renderLogin = function(req, res) {
  req.user ? 
    res.redirect('/profile') :
    res.render('registry/login', {error: req.flash('error')});
}

exports.renderSignup = function(req, res) {
  req.user ? 
    res.redirect('/profile') :
    res.render('registry/signup', {error: req.flash('error')});
}

exports.renderProfile = function(req, res) {
  res.render('profile');
}

exports.renderGraph = function(req, res) {
  res.render('oldviews/graph');
}

exports.serve404 = function(req, res) {
  res.status(404).send('Page not found!');
}