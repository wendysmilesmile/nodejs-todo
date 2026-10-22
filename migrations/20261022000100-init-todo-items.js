'use strict';

let dbm;
let type;
let seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const file = `${__dirname}/sqls/20261022000100-init-todo-items-up.sql`;
  return new Promise((resolve, reject) => {
    require('fs').readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  }).then((data) => db.runSql(data));
};

exports.down = function(db) {
  const file = `${__dirname}/sqls/20261022000100-init-todo-items-down.sql`;
  return new Promise((resolve, reject) => {
    require('fs').readFile(file, { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  }).then((data) => db.runSql(data));
};

exports._meta = {
  version: 1
};
