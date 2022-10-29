var assert = require('assert'),
  fs = require('fs'),
  rimraf = require('rimraf');

var MetaFile = require('../../lib/meta/file')

describe('meta/file', function() {

  var path = __dirname + '/foo.json';
  var cleanup = function() {
    rimraf.sync(path)
  };

  before(cleanup);
  after(cleanup);

  var meta = new MetaFile({path: path});

  describe('set()', function() {
    it('should save data', function(done) {
      meta.set({migrations: [{filename: 'one'}, {filename: 'two'}]}, function(err) {
        if (err) return done(err);
        assert.equal(fs.readFileSync(path, 'utf8'), '{"migrations":[{"filename":"one"},{"filename":"two"}]}');
        done();
      })
    })
  })

  describe('get()', function() {
    it('should return data', function(done) {
      meta.get(function(err, data) {
        if (err) return done(err);
        assert.deepEqual(data, {migrations: [{filename: 'one'}, {filename: 'two'}]});
        done();
      })
    })
  })

})
