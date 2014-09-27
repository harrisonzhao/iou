'use strict';
(require('rootpath')());

var db = require('config/orm');

var Invites = db.define('invites', {
  invite_id : { type: "serial", key: true }, // autoincrementing primary key
  is_empty  : { type: "boolean", required: true, defaultValue: 0 },
}, {
  methods : {

  }
});

module.exports = Invites;
