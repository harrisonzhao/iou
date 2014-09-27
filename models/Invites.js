'use strict';
(require('rootpath')());

var async = require('async');
var db = require('config/orm');

var Invites = db.define('invites', {
  invite_id : { type: "serial", key: true }, // autoincrementing primary key
  complete  : { type: "boolean", required: true, defaultValue: 0 },
}, {
  methods : {
    /**
     * @param  {Function} callback
     * args: (err)
     */
    completeInvite : function(callback) {
      this.complete = 1;
      this.save(callback);
    },

    /**
     * @param  {obj} room
     * @param  {obj} receiver
     * @param  {Function} callback
     * args (err)
     */
    linkRelations : function(room, receiver, callback) {
      var that = this;
      async.waterfall(
      [
        function(callback) {
          that.setRoom(room, callback);
        },
        function(callback) {
          that.setReceiver(receiver, callback);
        }
      ],
      callback);
    }
  }
});

Invites.newInvite = function(room, user, callback) {
  var invite = {
    complete : 0
  };
  var that = this;
  async.waterfall(
  [
    function(callback) {
      that.count(
        {
          room_room_id: room.room_id, 
          receiver_user_id: user.user_id
        }, 
        function(err, count) {
          if (err) { return callback(err); }
          if (count) {
            callback(new Error('Invite already exists for this user'));
          } else {
            callback(null);
          }
        });
    },
    function(callback) {
      that.create(invite, callback);
    }
  ],
  function(err, result) {
    if (err) { return callback(err); }
    result.linkRelations(room, user);
    callback(null, result);
  });
};

module.exports = Invites;
