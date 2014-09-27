'use strict';
(require('rootpath')());

var async = require('async');
var db = require('config/orm');

var Invites = db.define('invites', {
  invite_id : { type: "serial", key: true }, // autoincrementing primary key
  complete  : { type: "boolean", required: true, defaultValue: 0 },
}, {
  methods : {
    completeInvite : function() {
      this.complete = 1;
      this.save(function(err) {
        if (err) console.log("Error saving invitation");
      });
    },

    linkRelations : function(room, receiver) {
      this.setRoom(room, function(err) {
        if (err) console.log("Error linking invite to room");
      });
      this.setReceiver(receiver, function(err) {
        if (err) console.log("Error linking invite to room");
      });
    }
  }
});

Invites.newInvite = function(room, user, callback) {
  var invite = {
    complete : 0
  };

  async.waterfall(
  [
    function(callback) {
      this.count({room_room_id: room.room_id, receiver_user_id: user.user_id}, function(err, count) {
        if (err) { return callback(err); }
        if (count) {
          callback(new Error('one too many!'));
        } else {
          callback(null);
        }
      });
    },
    function(callback) {
      this.create(invite, callback);
    }
  ],
  function(err, result) {
    if (err) { return callback(err); }
    result.linkRelations(room, user);
    callback(null, result);
  });
};

module.exports = Invites;
