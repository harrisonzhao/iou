'use strict';
(require('rootpath')());

var db = require('config/orm');

var Invites = db.define('invites', {
  invite_id : { type: "serial", key: true }, // autoincrementing primary key
  complete  : { type: "boolean", required: true, defaultValue: 0 },
}, {
  methods : {
    completeInvite : function() {

    },
    linkRelations : function(room, receiver) {

    }
  }
});

Invites.newInvite = function(room, user, callback) {
  var invite = {
    complete : 0
  };

  this.create(invite, function(err, result) {
    if (err) {
      console.log("Error creating new invite");
    } else {
      result.linkRelations(room, user);
    }

    callback(err, result);
  });
};

module.exports = Invites;
