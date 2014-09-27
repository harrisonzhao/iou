'use strict';
(require('rootpath')());

var db = require('config/orm');

var Rooms = db.define('rooms', {
  room_id  : { type: "serial", key: true }, // autoincrementing primary key
  name     : { type: "text", size: 40, required: true },
  is_empty : { type: "boolean", required: true, defaultValue: 0 },
  graph    : { type: "object" },
}, {
  methods : {
    addUser : function(user, callback) {
      var that = this;
      this.addUsers(user, function(err) {
        if (err) callback(new Error("Error adding user"), that);
        else {
          that.is_empty = 0;
          that.save();
          callback(err, that);
        }
      });

    },
    removeUser : function(user, callback) {

    }
  }
});

// name : string, creator : Users object
Rooms.newRoom = function(name, creator, callback) {
  var room = {
    name     : name,
    is_empty : 1,
    graph    : {} // TODO: modify this?
  };

  this.create(room, function(err, result) {
    if (!err) result.addUser(creator, callback);
    else callback(err, result);
  });
};

module.exports = Rooms;
