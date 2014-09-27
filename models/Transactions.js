'use strict';
(require('rootpath')());

var db = require('config/orm');

var Transactions = db.define('transactions', {
  transaction_id : { type: "serial", key: true }, // autoincrementing primary key
  value          : { type: "integer", required: true },
  reason         : { type: "text", size: 140, required: true },
  created_time   : { type: "date", required: true },
  approved_time  : { type: "date", defaultValue: null}
}, {
  methods : {

  }
});

module.exports = Transactions;
