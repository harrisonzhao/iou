'use strict';
(require('rootpath')());

var db = require('config/orm');

var Users = db.define('users', {
  user_id       : { type: "serial", key: true }, // autoincrementing primary key
  first_name    : { type: "text", size: 20, required: true },
  last_name     : { type: "text", size: 20, required: true },
  email         : { type: "text", size: 45, required: true, unique: true},
  password_hash : { type: "text", size: 60, required: true },
}, {
  methods : {

  }
});

module.exports = Users;
