exports.up = function(cb) {
  setTimeout(function() {
    cb(null, 'ccc: up');
  }, 10);
}

exports.down = function(cb) {
  setTimeout(function() {
    cb(null, 'ccc: down');
  }, 10);
}
