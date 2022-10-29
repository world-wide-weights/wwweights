node-migrations
============

[![npm version](https://badge.fury.io/js/migrations.svg)](https://badge.fury.io/js/migrations)
![Build Status](https://github.com/Adslot/node-migrations/actions/workflows/node.js.yml/badge.svg)

Data agnostic migrations

## Installation

    npm i migrations

## Usage

In order to use this module you need to have a bootstrap file (e.g. `migrations.js`) where you
can initialize db, specify your own meta storage adapter and so on.

```javascript
var Migrations = require('migrations'),
  MetaFile = require('migrations/lib/meta/file');

module.exports = new Migrations({
  dir: __dirname + '/migrations', // directory with migration files
  meta: new MetaFile({path: __dirname + '/migrations.json'}) // meta information storage
  template: '', // template used by `--create` flag to generate a new migration file
});

module.exports.run();
```

You can specify your custom store of meta data, e.g.:

```javascript
var Migrations = require('migrations'),
  meta = {};

// Meta Storage has very basic interface:
var storage = {
  get: function (cb) {
    cb(null, meta);
  },
  set: function (value, cb) {
    meta = value;
    cb();
  },
};

module.exports = new Migrations({
  dir: __dirname + '/migrations',
  meta: storage, // custom storage
});

module.exports.run();
```

### Using with `npm`

You can put a special task in package.json file:

```
{
  "name": "my-project",
  "scripts": {
    "migrate": "node migrations.js"
  }
}
```

and then you be able to do `npm run migrate`. Another option is to add shebang
to the _migrations_ executable and run it in a manual way.

## Cli interface

```
  Usage: migrations.js [options]

  Options:

    -h, --help  output usage information
    --up      Migrate up
    --down    Migrate down
    --create  Create empty migration file
    --count   Migrate particular number of migration
    --revert  Revert last migration
```
