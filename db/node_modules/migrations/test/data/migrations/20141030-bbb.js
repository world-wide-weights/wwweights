exports.up = function(cb) {
  setTimeout(function() {
    cb(null, 'bbb: up');
  }, 10);
}

exports.down = function(cb) {
  setTimeout(function() {
    cb(null, 'bbb: down');
  }, 10);
}
