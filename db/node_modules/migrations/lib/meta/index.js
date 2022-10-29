
function Decorator(meta) {
  this._get = meta.get.bind(meta);
  this.set = meta.set.bind(meta);
}


Decorator.prototype.up = function(filename, cb) {
  var self = this;
  this.get(function(err, data) {
    if (err) return cb(err);

    data = data || {};
    data.migrations = data.migrations || [];
    data.migrations.push({filename: filename, ts: Date.now()});
    self.set(data, cb);
  });
};


Decorator.prototype.down = function(filename, cb) {
  var self = this;
  this.get(function(err, data) {
    if (err) return cb(err);

    data = data || {};
    data.migrations = data.migrations || [];
    data.migrations = data.migrations.filter(function(item) {
      return item.filename !== filename;
    });
    self.set(data, cb);
  });
};


Decorator.prototype.get = function(cb) {
  this._get(function(err, data) {
    if (err) return cb(err);
    data = data || {};
    data.migrations = data.migrations || [];
    data.migrations.forEach(function(i) {
      i.ts = i.ts || 0;
    });
    data.migrations.sort(function(a, b) {
      return a.ts - b.ts;
    });
    cb(null, data);
  });
};


Decorator.prototype.flush = function(cb) {
  this.set({migrations: []}, cb);
};


module.exports = Decorator;
