'use strict';
(require('rootpath')());

var db = require('config/orm');
var Users = require('./Users');
var Rooms = require('./Rooms');
var Transactions = require('./Transactions');
var Invites = require('./Invites');

Users.hasMany('rooms', Rooms, {}, { reverse: 'users' });
Invites.hasOne('room', Rooms);
Invites.hasOne('receiver', Users);
Transactions.hasOne('room', Rooms);
Transactions.hasOne('source', Users);
Transactions.hasOne('sink', Users);

var models = {
  Users: Users,
  Rooms: Rooms,
  Transactions: Transactions,
  Invites: Invites
};

db.sync( function(err) {
  !err && console.log("Synced database!");
});

module.exports = models;
