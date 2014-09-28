'use strict';
(require('rootpath')());
var async = require('async');
var models = require('models/models');
var Users = models.Users;
var Rooms = models.Rooms;
var Transactions = models.Transactions;
var Invites = models.Invites;

//get req
//send invite to an email
//need email
//need roomId
exports.sendInviteForRoom = function(req, res, next) {
  var roomId = parseInt(req.query.roomId);
  var getRoomAndOtherUser = function(callback) {
    async.parallel(
    [
      function(callback) {
        Users.one({email: req.query.email}, callback);
      },
      function(callback) {
        Rooms.get(roomId, callback);
      }
    ],
    callback);
  };
  async.waterfall(
  [
    function(callback) {
      getRoomAndOtherUser(function(err, results) {
        //[0] is user
        //[1] is room
        callback(err, results[0], results[1]);
      });
    },
    function(otherUser, room, callback) {
      Invites.newInvite(room, otherUser, callback);
    }
  ],
  function(err, newInvite) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

//get req
exports.getInvites = function(req, res, next) {
  req.user.getInvites(function(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
}

//get req
//create room
//needs roomName
exports.createRoom = function(req, res, next) {
  req.query.roomName = req.query.roomName || 'DEFAULT NAME';
  Rooms.create(req.query.roomName, req.user, function(err, result) {
    if (err) { return next(err); }
    res.sendStatus(200);
  })
}

//get req
exports.getRooms = function(req, res, next) {
  req.user.getRooms(function(err, rooms) {
    if (err) { return next(err); }
    res.send(rooms);
  });
}

//get req
//need roomId
exports.leaveRoom = function(req, res, next) {
  var roomId = parseInt(req.query.roomId);
  async.waterfall(
  [
    function(callback) {
      Rooms.get(roomId, callback);
    },
    function(room, callback) {
      room.removeUser(req.user, callback);
    }
  ],
  function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

//get req
//need roomId
exports.getRoomTransactionHistory = function(req, res, next) {
  var roomId = parseInt(req.query.roomId);
  async.waterfall(
  [
    function(callback) {
      Rooms.get(roomId, callback);
    },
    function(room, callback) {
      room.getTransactions(callback);
    }
  ],
  function(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
}

//get req
//need roomId
//need id of other user (being charged)
//need value
//need reason
exports.requestTransaction = function(req, res, next) {
  var value = parseInt(req.query.value);
  var id = parseInt(req.query.id);
  var roomId = parseInt(req.query.roomId);
  if (!value || !id || !roomId) { return next(new Error('invalid values')); }
  var source, sink;
  req.query.reason = req.query.reason || 'no reason';
  var getRoomAndOtherUser = function(callback) {
    async.parallel(
    [
      function(callback) {
        Users.get(id, callback);
      },
      function(callback) {
        Rooms.get(roomId, callback);
      }
    ],
    callback);
  };

  async.waterfall(
  [
    function(callback) {
      getRoomAndOtherUser(function(err, result) {
        err ? callback(err) : callback(null, result[0], result[1]);
      });
    },
    function(otherUser, room, callback) {
      if (value > 0) {
        sink = req.user;
        source = otherUser;
      } else if (value < 0) {
        sink = otherUser;
        source = req.user;
      } else {
        callback(new Error('cannot have 0 value'));
      }
      Transactions.newTransaction(room, source, sink, value, req.query.reason, function(err, result) {
        callback(err);
      });
    }
  ],
  //result not used
  function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

//get req
//need transactionId
exports.approveTransaction = function(req, res, next) {
  var transactionId = parseInt(req.query.transactionId);
  if (!transactionId) { next(new Error('invalid transactionId')); }
  async.waterfall(
  [
    function(callback) {
      Transactions.get(transactionId, callback);
    },
    function(transaction, callback) {
      transaction.approve(callback);
    }
  ],
  function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}

//get req
//potentially lots of transactions
//NOTE: augment transaction with isSource (to distinguish who user is)
exports.getUserPendingTransactions = function(req, res, next) {
  async.waterfall(
  [
    function(callback) {
      Transactions.find({ approved_time: null }, callback);
    },
    function(unfilteredTransactions, callback) {
      async.filter(
        unfilteredTransactions, 
        function(transaction, callback) {
          callback(
            transaction.source === req.user.user_id ||
            transaction.sink === req.user.user_id); 
        }, callback);
    },
    function(transactions, callback) {
      async.map(transactions, function(transaction, callback) {
        if (transaction.source === req.user.user_id) {
          transaction.isSource = true;
        } else {
          transaction.isSource = false
        }
        callback(null, transaction);
      }, callback);
    }
  ],
  function(err, results) {
    if (err) { return next(err); }
    res.send(results);
  });
}