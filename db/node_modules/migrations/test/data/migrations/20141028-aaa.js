exports.up = function(cb) {
  setTimeout(function() {
    cb(null, 'aaa: up');
  }, 10);
}

exports.down = function(cb) {
  setTimeout(function() {
    cb(null, 'aaa: down');
  }, 10);
}
