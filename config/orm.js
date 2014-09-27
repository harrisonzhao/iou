var orm = require('orm');
var settings = require('./settings/exports');
var db = orm.connect(settings.secrets.mysqlConfigs);

db.on('connect', function (err) {
  if (err) {
    console.log('Something is wrong with the connection', err);
    return;
  }
});

module.exports = db;