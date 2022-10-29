var assert = require('assert'),
  rimraf = require('rimraf'),
  Migrant = require('../lib/migrant'),
  MetaMemory = require('../lib/meta/memory');


describe('index', function() {

  var path = __dirname + '/foo.json';
  var cleanup = function() {
    rimraf.sync(path)
  };

  var noon = function() {};

  before(cleanup);
  after(cleanup);


  var m = new Migrant({
    meta: new MetaMemory,
    dir: __dirname + '/data/migrations'
  });
  var meta = m.meta;


  beforeEach(function(done) {
    meta.flush(done)
  })


  describe('list()', function() {

    it('should return a list (up, 10, empty meta)', function(done) {
      meta.set(null, noon)
      m.list('up', 10, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, [
          '20141028-aaa.js',
          '20141030-bbb.js',
          '20141031-ccc.js',
          '20150601-ddd.js',
          '20150701-eee.js',
        ]);
        done()
      });
    });

    it('should return a list (up, 10)', function(done) {
      meta.set({migrations: [{filename: '20141028-aaa.js', ts: 11}]}, noon)
      m.list('up', 10, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, [
          '20141030-bbb.js',
          '20141031-ccc.js',
          '20150601-ddd.js',
          '20150701-eee.js',
        ]);
        done()
      });
    });

    it('should return a list to execute (up, 1)', function(done) {
      meta.set({migrations: [{filename: '20141028-aaa.js', ts: 11}]}, noon)
      m.list('up', 1, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, ['20141030-bbb.js']);
        done()
      });
    });

    it('should return a list to execute (down, 1}', function(done) {
      meta.set({migrations: [
        {filename: '20141028-aaa.js', ts: 11},
        {filename: '20141030-bbb.js', ts: 22},
      ]}, noon)
      m.list('down', 1, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, ['20141030-bbb.js']);
        done()
      });
    });

    it('should return a list to execute (down, 1}, mixed seq', function(done) {
      meta.set({migrations: [
        {filename: '20141028-aaa.js', ts: 22},
        {filename: '20141030-bbb.js', ts: 11},
      ]}, noon)
      m.list('down', 1, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, ['20141028-aaa.js']);
        done()
      });
    });

    it('should return a list to execute (down, 1}, mixed seq', function(done) {
      meta.set({migrations: [
        {filename: '20141028-aaa.js', ts: 22},
        {filename: '20141027-ccc.js'},
        {filename: '20141030-bbb.js', ts: 11},
        {filename: '20141026-ddd.js'}
      ]}, noon)
      m.list('down', 1, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, ['20141028-aaa.js']);
        done()
      });
    });

    it('should return a list to execute (down, 10}', function(done) {
      meta.set({migrations: [
        {filename: '20141028-aaa.js', ts: 11},
        {filename: '20141030-bbb.js', ts: 22},
      ]}, noon)
      m.list('down', 10, function(err, list) {
        if (err) return done(err);
        assert.deepEqual(list, ['20141030-bbb.js', '20141028-aaa.js']);
        done()
      });
    });

  });


  describe('migrateSingle()', function() {
    it('should migrate up', function(done) {
      m.migrateSingle('up', '20141030-bbb.js', function(err, res) {
        if (err) return done(err);
        assert.deepEqual(res, ['bbb: up', undefined]); // "bbb: up" thing is from migration

        m.meta.get(function(err, data) {
          if (err) return done(err);

          assert.equal(data.migrations.length, 1);
          assert.equal(data.migrations[0].filename, '20141030-bbb.js')
          done()
        })
      })
    });
  });


  describe('migrate()', function() {
    it('should migrate up', function(done) {
      meta.set({migrations: [{filename: '20150601-ddd.js', ts: 11}]}, noon)
      m.migrate('up', 10, function(err, res) {
        if (err) return done(err);

        assert.deepEqual(res, [
          ['aaa: up', undefined],
          ['bbb: up', undefined],
          ['ccc: up', undefined],
          ['eee: up', undefined]
        ]);

        m.meta.get(function(err, data) {
          if (err) return done(err);

          migrations = data.migrations.map(function(m) {
            return m.filename;
          });

          assert.deepEqual(migrations, [
            '20150601-ddd.js',
            '20141028-aaa.js',
            '20141030-bbb.js',
            '20141031-ccc.js',
            '20150701-eee.js'
          ])
          done()
        })
      })
    });

    it('should recognise double callbacks', function(done){
      m.migrate('up', 10, function(err, res) {
        assert.equal(err, 'Error: The callback called more than once in 20150601-ddd.js')
        done()
      });
    });
  });


});
