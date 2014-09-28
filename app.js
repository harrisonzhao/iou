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

var api = require('controllers/api');

//ALL POST DATA IS IN BODY
//ALL GET DATA IS IN QUERY
//get all your invites
app.get('/invites', api.getInvites); //query params: none needed! 
//send an invite to another email for room with given roomId
app.post('/invites/new', api.sendInviteForRoom); //email, roomId
//accept an invite with inviteId 
app.post('/invites/accept', api.acceptInvite); //inviteId

//create new room with roomName
app.post('/rooms/new', api.createRoom); //roomName
//get all your rooms
app.get('/rooms', api.getRooms); //none needed!
//leave room with given roomId
app.post('/rooms/leave', api.leaveRoom); //roomId

//get transaction history for room with given roomId
app.get('/transactions', api.getRoomTransactionHistory); //roomId
//get all pending transactions for user (augments each transaction with isSource(specifies if user is source or not))
app.get('/transactions/pending', api.getUserPendingTransactions); //none needed!
//request a transaction
app.post('/transactions/new', api.requestTransaction); //need roomId, id of other user, value (charge amount), reason
//approve a transaction with given transactionId
app.post('/transactions/approve', api.approveTransaction); //transactionId

// var models = require('models/models');
// models.Users.newUser('Pusheen', 'the Cat', 'pusheen@pusheen.cat', 'asdf', function(err, result) {
//   console.log(err ? err : result);
// });

// models.Users.one({email: "asdf"}, function(err, user) {
//   models.Rooms.newRoom("Pusheen", user, function(err, room) {
//     if (err) console.log(err);
//   });
// });

// models.Users.one({email : "asdf2"}, function(err, user) {
//   models.Rooms.one({name : "Pusheen"}, function(err, room) {
//     models.Invites.newInvite(room, user, function(err, invite) {
//       if (err) console.log(err);
//     });
//   });
// });

// models.Invites.one({receiver_user_id : 111}, function(err, invite) {
//   invite.completeInvite(function(err) {
//     if (err) console.log(err);
//   });
// });

// models.Users.one({first_name : "abc"}, function(err, user) {
//   models.Rooms.one({name : "pusheen"}, function(err, room) {
//     models.Invites.newInvite(room, user, function(err, invite) {
//       if (err) console.log(err);
//     });
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
