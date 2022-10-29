var assert = require('assert'),
  fs = require('fs'),
  rimraf = require('rimraf');

var MetaMemory = require('../../lib/meta/memory'),
  Decorator = require('../../lib/meta')

describe('meta/index', function() {

  var meta = new Decorator(new MetaMemory);

  before(function(done) {
    meta.set({migrations: [{filename: 'one'}]}, done);
  });

  describe('properties', function() {
    it('should have wrapped methods', function() {
      assert.equal(typeof meta.set, 'function');
      assert.equal(typeof meta.get, 'function');
    });
  });

  describe('up()', function() {
    it('should push new migration to the meta', function(done) {
      meta.up('two', function(err) {
        if (err) return done(err);

        meta.get(function(err, data) {
          if (err) return done(err);

          assert.equal(data.migrations.length, 2);
          assert(data.migrations.some(function(m) {
            return m.filename === 'two' && m.ts > 1;
          }));
          done();
        });
      });
    });
  });

  describe('down()', function() {
    it('should pop existing migration from the meta', function(done) {
      meta.down('one', function(err) {
        if (err) return done(err);

        meta.get(function(err, data) {
          if (err) return done(err);

          assert.equal(data.migrations.length, 1);
          assert(data.migrations.some(function(m) {
            return m.filename === 'two' && m.ts > 1;
          }))
          done()
        })
      })
    })
  })

})
