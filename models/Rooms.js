'use strict';
(require('rootpath')());

var async = require('async');
var db = require('config/orm');
var graph = require('lib/graph');

var Rooms = db.define('rooms', {
  room_id  : { type: "serial", key: true }, // autoincrementing primary key
  name     : { type: "text", size: 40, required: true },
  is_empty : { type: "boolean", required: true, defaultValue: 0 },
  graph    : { type: "object" },
}, {
  methods : {
    /**
     * @param  {obj}   user     [description]
     * @param  {Function} callback
     * args: err, room
     */
    addUser : function(user, callback) {
      var that = this;
      async.waterfall(
      [
        function(callback) {
          that.addUsers(user, function(err) {
            if (err) callback(err);
            else callback(null);
          });
        },
        function(callback) {
          that.is_empty = 0;
          graph.addUser(that.graph, user);
          // This is because of javascript pointers
          // orm saving does not recognize a change because the pointer has not changed
          // to get around this, we stringify and parse
          that.graph = JSON.parse(JSON.stringify(that.graph));
          that.save(callback);
        }
      ], callback);
    },

    /**
     * @param  {obj}   user     [description]
     * @param  {Function} callback
     * args: err, room
     */
    removeUser : function(user, callback) {
      var that = this;
      async.waterfall(
      [
        function(callback) {
          if (graph.checkWorth(that.graph, user) === 0) that.removeUsers(user, callback);
          else callback(new Error("Worth not zero"));
        },
        function(callback) {
          that.getUsers(function(err, users) {
            if (err) { callback(err); }
            else {
              if (users.length === 0) {
                that.is_empty = 1;
              }
              graph.removeUser(that.graph, user);
              that.graph = JSON.parse(JSON.stringify(that.graph));
              callback(null);
            }
          });
        },
        function(callback) {
          that.save(callback);
        }
      ], callback);
    }
  }
});

// name : string, creator : Users object
Rooms.newRoom = function(name, creator, callback) {
  var room = {
    name     : name,
    is_empty : 1,
    graph    : graph.newGraph()
  };

  this.create(room, function(err, result) {
    if (!err) result.addUser(creator, callback);
    else callback(err, result);
  });
};

module.exports = Rooms;
