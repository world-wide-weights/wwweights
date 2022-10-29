async = require('async')


exports.up = function(next) {
  async.each([1, 2, 3, 4], function(colName, cb) {
    next(null, 'ddd: up')
  }, next);
}


exports.down = function(cb) {
  setTimeout(function() {
    cb(null, 'ddd: down');
  }, 10);
}
