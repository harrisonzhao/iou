'use strict';
var multiline = require('multiline');

var bcrypt = require('bcrypt');
//must load db.js instead of configs.js to avoid circular referencing
var connection = require('config/db');

var insertQuery = multiline(function() {/*
  INSERT INTO Users (email, password) 
  VALUES (?, ?);
*/});
function insert(email, passwordHash, callback) {
  connection.query(
    insertQuery, 
    [email, passwordHash], 
    callback);
}

var selectByUserIdQuery = multiline(function() {/*
  SELECT * FROM Users 
  WHERE userId=?;
*/});
function selectByUserId(userId, callback) {
  connection.query(selectByUserIdQuery, [userId], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

var selectByEmailQuery = multiline(function() {/*
  SELECT * FROM Users 
  WHERE email=?;
*/});
function selectByEmail(email, callback) {
  connection.query(selectByEmailQuery, [email], function(err, result) {
    err ? callback(err) : callback(null, result[0]);
  });
}

function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isValidPassword(unhashedPassword, hashedPassword) {
  return bcrypt.compareSync(unhashedPassword, hashedPassword);
}

exports.insert = insert;
exports.selectById = selectByUserId;
exports.selectByEmail = selectByEmail;

exports.utils = {};
exports.utils.generateHash = generateHash;
exports.utils.isValidPassword = isValidPassword;