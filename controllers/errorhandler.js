'use strict';

var errorHandler = function (err, req, res, next) {
  console.log(err);
  console.log(err.stack);
  console.trace();
  res.send(404, err);
}

exports.errorHandler = errorHandler;