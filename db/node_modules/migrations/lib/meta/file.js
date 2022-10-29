var fs = require('fs');


function File(opts) {
  this.opts = opts;
};


File.prototype.set = function(data, cb) {
  fs.writeFile(this.opts.path, JSON.stringify(data), {encoding: 'utf8'}, cb);
};


File.prototype.get = function(cb) {
  fs.readFile(this.opts.path, {encoding: 'utf8'}, function(err, data) {
    cb(err, err ? null : JSON.parse(data));
  });
};

module.exports = File;
