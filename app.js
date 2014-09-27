//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
var configs = require('config/configs');
configs.configure(app);

/*var models = require('models/models');
models.Users.newUser('abc', 'def', 'hij', 'klm', function(err, result) {
  console.log(err ? err : result);
})*/
var registry = require('controllers/registry');
// var staticPages = require('controllers/pages');
// app.get('/', staticPages.renderIndex);
// app.get('/login/', staticPages.renderLogin);
// app.get('/signup', staticPages.renderSignup);

//var auth = require('controllers/auth');
//app.get('/logout', auth.logout);

//app.all('*', auth.checkLoggedIn);

// app.get('*', staticPages.serve404);

app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);

