'use strict';
(require('rootpath')());

var db = require('config/orm');

var Rooms = db.define('rooms', {
  room_id  : { type: "serial", key: true }, // autoincrementing primary key
  name     : { type: "text", size: 40, required: true },
  is_empty : { type: "boolean", required: true, defaultValue: 0},
  graph    : { type: "binary" },
}, {
  methods : {

  }
});

Rooms.sync( function(err) {
  !err && console.log("Synced rooms!");
});

module.exports = Rooms;
