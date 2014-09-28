'use strict';
(require('rootpath')());

var db = require('config/orm');
var bcrypt = require('bcryptjs');

var Users = db.define('users', {
  user_id       : { type: "serial", key: true }, // autoincrementing primary key
  first_name    : { type: "text", size: 20, required: true },
  last_name     : { type: "text", size: 20, required: true },
  email         : { type: "text", size: 45, required: true, unique: true },
  password_hash : { type: "text", size: 60, required: true },
  is_admin      : { type: "boolean", required: true, defaultValue: 0 },
}, {
  methods : {
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password_hash);
    },

    fullName : function() {
      return this.first_name + " " + this.last_name;
    }
  }
});

Users.newUser = function(firstName, lastName, email, password, callback) {
  var user = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password_hash: bcrypt.hashSync(password, 8),
    is_admin: false
  };
  this.create(user, callback);
};

module.exports = Users;
