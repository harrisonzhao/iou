//file used to load other routes
'use strict';
(require('rootpath')());

var express = require('express');
var app = module.exports = express();
var configs = require('config/configs');
configs.configure(app);

var registry = require('controllers/registry');

app.get('/', registry.renderIndex);
app.get('/signup', registry.renderSignup);
app.get('/login', registry.renderLogin);
app.get('/graph', registry.renderGraph);

var auth = require('controllers/auth');
app.post('/login', auth.localLogin);
app.post('/signup', auth.localSignup);
app.all('*', auth.checkLoggedIn);
app.get('/logout', auth.logout);

var models = require('models/models');
// models.Users.newUser('abc', 'def', 'hij', 'klm', function(err, result) {
//   console.log(err ? err : result);
// })

// models.Users.one({first_name : "Rene"}, function(err, result) {
//   models.Rooms.newRoom("pusheen", result, function(err, result) {
//     console.log("Hello");
//   });
// });

// var staticPages = require('controllers/pages');
// app.get('/', staticPages.renderIndex);
// app.get('/login/', staticPages.renderLogin);
// app.get('/signup', staticPages.renderSignup);

//var auth = require('controllers/auth');
//app.get('/logout', auth.logout);

//app.all('*', auth.checkLoggedIn);

// app.get('*', staticPages.serve404);
var errorHandler = require('controllers/errorHandler');
app.use(errorHandler.errorHandler);
app.listen(configs.settings.secrets.port);
console.log('listening on port ' + configs.settings.secrets.port);

//login/landing page
//signup 
//rooms
//graph
//add for transaction
