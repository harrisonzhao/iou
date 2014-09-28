'use strict';
(require('rootpath')());

var db = require('config/orm');
var async = require('async');

var Transactions = db.define('transactions', {
  transaction_id : { type: "serial", key: true }, // autoincrementing primary key
  value          : { type: "integer", required: true },
  reason         : { type: "text", size: 140, required: true },
  created_time   : { type: "date", required: true },
  approved_time  : { type: "date", defaultValue: null }
}, {
  methods : {
    /**
     * @param  {Function} callback
     * args: err, transaction
     */
    approve : function(callback) {
      if (this.approved_time === null) {
        this.approved_time = new Date();
        this.save(function(err) {
          callback(err, this);
        });
      }
    },

    /**
     * @param  {obj}   room     [description]
     * @param  {obj}   source   [description]
     * @param  {obj}   sink     [description]
     * @param  {Function} callback
     * args: err, transaction
     */
    linkRelations : function(room, source, sink, callback) {
      var that = this;
      async.waterfall(
      [
        function(callback) {
          that.setRoom(room, callback);
        },
        function(callback) {
          that.setSource(source, callback);
        },
        function(callback) {
          that.setSink(sink, callback);
        }
      ],
      function(err) {
        callback(err, that);
      });
    }
  }
});

Transactions.newTransaction = function(room, source, sink, value, reason, callback) {
  var transaction = {
    value         : value,
    reason        : reason,
    created_time  : new Date(),
    approved_time : null
  };

  if (sink.user_id === source.user_id) {
    return callback(new Error("sink equals source"));
  }

  var that = this;
  async.waterfall(
  [
    function(callback) {
      source.hasRooms(room, function(err, inRoom) {
        if (err) { return callback(err); }
        if (inRoom) callback(new Error("Source not in room"));
        else callback(null);
      });
    },
    function(callback) {
      sink.hasRooms(room, function(err, inRoom) {
        if (err) { return callback(err); }
        if (inRoom) callback(new Error("Sink not in room"));
        else callback(null);
      });
    },
    function(callback) {
      this.create(transaction, callback);
    }
  ],
  function(err, result) {
    if (err) callback(err, result);
    else result.linkRelations(room, source, sink, callback);
  });
};

module.exports = Transactions;
