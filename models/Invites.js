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
     * args: err, invite
     */
    completeInvite : function(callback) {
      if (this.complete === 0) {
        var that = this;

        async.waterfall(
        [
          function(callback) {
            that.getRoom(callback);
          },
          function(room, callback) {
            that.getReceiver(function(err, receiver) {
              callback(err, room, receiver);
            });
          },
          function(room, receiver, callback) {
            receiver.hasRooms(room, function(err, inRoom) {
              callback(err, inRoom, receiver, room);
            });
          },
          function(inRoom, receiver, room, callback) {
            if (inRoom) callback(new Error("User already in room"), room);
            else room.addUser(receiver, callback);
          },
          function(room, callback) {
            that.complete = 1;
            that.save(callback);
          }
        ], function(err) {
          callback(err, that);
        });
      }
    },

    /**
     * @param  {obj} room
     * @param  {obj} receiver
     * @param  {Function} callback
     * args err, invite
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
      function(err) {
        callback(err, that);
      });
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
      user.hasRooms(room, function(err, inRoom) {
        if (err) { return callback(err); }
        if (inRoom) callback(new Error("User already in room"));
        else callback(null);
      });
    },
    function(callback) {
      that.count(
        {
          room_room_id: room.room_id,
          receiver_user_id: user.user_id
        },
        function(err, count) {
          if (err) { return callback(err); }
          if (count) callback(new Error('Invite already exists for this user'));
          else callback(null);
        });
    },
    function(callback) {
      that.create(invite, callback);
    },
    function(result, callback) {
      result.linkRelations(room, user, callback);
    }
  ],
  callback);
};

module.exports = Invites;
