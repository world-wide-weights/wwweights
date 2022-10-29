var assert = require('assert'),
  path = require('path'),
  fs = require('fs'),
  util = require('util'),
  async = require('async');

var MetaDecorator = require('./meta/');

const MODE_UP = 'up';
const MODE_DOWN = 'down';


function Migrant(opts) {
  this.opts = opts;
  this.meta = new MetaDecorator(opts.meta);
}


Migrant.prototype.migrate = function(mode, count, cb) {
  var self = this;
  this.list(mode, count, function(err, migrations) {
    if (err) return cb(err);
    async.mapSeries(migrations, self.migrateSingle.bind(self, mode), cb);
  });
};


Migrant.prototype.up = function(count, cb) {
  this.migrate(MODE_UP, count, cb);
};


Migrant.prototype.down = function(count, cb) {
  this.migrate(MODE_DOWN, count, cb);
};


Migrant.prototype.list = function(mode, count, cb) {
  var self = this;
  this.meta.get(function(err, data) {
    if (err) return cb(err);

    existing = data.migrations.map(function(i) {
      return i.filename
    });

    if (mode === MODE_DOWN)
      return cb(null, existing.reverse().slice(0, count));

    // get a list of available migrations in the directory
    var migrations = fs.readdirSync(self.opts.dir).sort().filter(function(filename) {
      return ~['.js', '.node', '.coffee'].indexOf(path.extname(filename))
        && filename.match(/^\d+/);
    });

    // reject ones that have been run
    if (data && data.migrations)
      migrations = migrations.filter(function(filename) {
        return !existing.some(function(item) {
          return item === filename;
        });
      });

    cb(null, migrations.slice(0, count));
  });
};


Migrant.prototype.migrateSingle = function(mode, filename, cb) {
  var self = this,
    migration = require(path.join(this.opts.dir, filename)),
    started = Date.now();
  const migrateFn = util.types.isAsyncFunction(migration[mode]) ? util.callbackify(migration[mode]) : migration[mode];

  this.log(filename, mode);
  let msg;
  async.series([
    function(cbInner) {
      migrateFn(function(err, res) {
        cbInner(err, res)
        // to check if the callback set correctly on each file.
        // if there is an error it will be written in the log file and will throw an error.
        cbInner = function() {
          if (msg) return;
          msg = 'The callback called more than once in ' + filename
          self.log(filename, msg, true);
          cb(new Error(msg));
        }
      });
    },
    self.meta[mode].bind(self.meta, filename) // save progress
  ], function(err, res) {
    if (msg) return;
    if (err) return cb(err);

    msg = 'completed in ' + formatTime(Date.now() - started);
    self.log(filename, msg, true);
    cb(null, res);
  });
};


Migrant.prototype.log = function(key, msg, delim) {
  if (this.opts.verbose) {
    console.log('  \033[90m%s :\033[0m \033[36m%s\033[0m', key, msg);
    if (delim)
      console.log('')
  }
};


var formatTime = function(time) {
  var millis = time % 1000;
  time = parseInt(time / 1000);
  var seconds = time % 60;
  time = parseInt(time / 60);
  var minutes = time % 60;
  time = parseInt(time / 60);
  var hours = time % 24;
  var out = '';
  if (hours && hours > 0) out += hours + ' ' + ((hours == 1) ? 'hr' : 'hrs') + ' ';
  if (minutes && minutes > 0) out += minutes + ' ' + ((minutes == 1) ? 'min' : 'mins') + ' ';
  if (hours == 0 && seconds && seconds > 0) out += seconds + ' ' + ((seconds == 1) ? 'sec' : 'secs') + ' ';
  if (minutes == 0 && millis && millis > 0) out += millis + ' ' + ((millis == 1) ? 'msec' : 'msecs') + ' ';
  return out.trim();
}


module.exports = Migrant;
