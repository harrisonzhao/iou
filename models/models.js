'use strict';
(require('rootpath')());

var db = require('config/orm');
var Users = require('./Users');
var Rooms = require('./Rooms');
var Transactions = require('./Transactions');
var Invites = require('./Invites');

Users.hasMany('rooms', Rooms, {}, { reverse: 'users' });
Invites.hasOne('room', Rooms, { reverse: 'invites'});
Invites.hasOne('receiver', Users, { reverse: 'invites'} );
Transactions.hasOne('room', Rooms, { reverse: 'transactions'});
Transactions.hasOne('source', Users, { reverse: 'asSource'});
Transactions.hasOne('sink', Users, { reverse: 'asSink'});

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