var orm = require('orm');
var settings = require('./settings/exports');

var dbConnection;
modules.exports = dbConnection;

orm.connect(settings.secrets.mysqlConfigs, function (err, db) {
  if (err) {
    console.log("Something is wrong with the connection", err);
    return;
  }

  dbConnection = db;
});