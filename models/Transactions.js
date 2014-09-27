'use strict';
(require('rootpath')());

var db = require('config/orm');

var Transactions = db.define('transactions', {
  transaction_id : { type: "serial", key: true }, // autoincrementing primary key
  value          : { type: "integer", required: true },
  reason         : { type: "text", size: 140, required: true },
  created_time   : { type: "date", required: true },
  approved_time  : { type: "date", defaultValue: null }
}, {
  methods : {
    approve : function() {

    },
    linkRelations : function(room, source, sink) {

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

  this.create(transaction, function(err, result) {
    if (err) {
      console.log("Error creating new transaction");
    } else {
      result.linkRelations(room, source, sink);
    }

    callback(err, result);
  });
};

module.exports = Transactions;
