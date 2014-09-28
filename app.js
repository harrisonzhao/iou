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
app.get('/profile', registry.renderProfile);
app.get('/graph', registry.renderGraph);
app.get('/lobby', registry.renderLobby);
app.get('/room/:id', function(req, res) {
  res.redirect('/graph/' + req.params.id);
});
app.get('/graph/:id', registry.renderGraph);

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
app.get('/transactions', api.getRoomTransactionHistory); //roomId x
//get all pending transactions for user (augments each transaction with isSource(specifies if user is source or not))
app.get('/transactions/pending', api.getUserPendingTransactions); //none needed! x
//request a transaction
app.post('/transactions/new', api.requestTransaction); //need roomId, id of other user, value (charge amount), reason x
//approve a transaction with given transactionId
app.post('/transactions/approve', api.approveTransaction); //transactionId

// var models = require('models/models');

// var pay = function(room_id, email1, email2, value, reason) {
//   models.Rooms.get(room_id, function(err, room) {
//     models.Users.one({email : email1}, function(err, user1) {
//       models.Users.one({email : email2}, function(err, user2) {
//         models.Transactions.newTransaction(room, user1, user2, value, reason, function(err, trans) {
//           if (err) console.log(err);
//         });
//       });
//     });
//   });
// };

// pay(21, 'asdf3', 'asdf', 500, 'stuff');

// models.Transactions.one({transaction_id : 331}, function(err, trans) {
//   trans.approve(function(err) {
//     if (err) console.log(err);
//   });
// });

// models.Users.newUser('Pusheen', 'the Cat', 'pusheen@pusheen.cat', 'asdf', function(err, result) {
//   console.log(err ? err : result);
// });

// models.Users.one({email: "asdf"}, function(err, user) {
//   models.Rooms.newRoom("Pusheen3", user, function(err, room) {
//     if (err) console.log(err);
//   });
// });

// models.Users.one({email : "asdf3"}, function(err, user) {
//   models.Rooms.one({room_id : 21}, function(err, room) {
//     models.Invites.newInvite(room, user, function(err, invite) {
//       if (err) console.log(err);
//     });
//   });
// });

// models.Invites.one({invite_id : 51}, function(err, invite) {
//   invite.acceptInvite(function(err) {
//     if (err) console.log(err);
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
