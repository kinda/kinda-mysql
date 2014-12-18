'use strict';

var mysql = require('mysql');

var kindaMySQL = {
  createPool: function(options) {
    var mysqlPool = mysql.createPool(options);
    var pool = {
      getConnection: function() {
        return function(cb) {
          mysqlPool.getConnection(function(err, mysqlConnection) {
            if (err) return cb(err);
            var connection = {
              query: function(sql, values) {
                return function(cb) {
                  mysqlConnection.query(sql, values, function(err, res) {
                    cb(err, res);
                  });
                };
              },
              format: mysql.format.bind(mysql),
              escape: mysql.escape.bind(mysql),
              escapeId: mysql.escapeId.bind(mysql),
              release: mysqlConnection.release.bind(mysqlConnection)
            };
            cb(null, connection);
          });
        };
      },
      query: function(sql, values) {
        return function(cb) {
          mysqlPool.query(sql, values, function(err, res) {
            cb(err, res);
          });
        };
      },
      on: mysqlPool.on.bind(mysqlPool),
      format: mysql.format.bind(mysql),
      escape: mysql.escape.bind(mysql),
      escapeId: mysql.escapeId.bind(mysql),
      end: function() {
        return function(cb) {
          mysqlPool.end(cb);
        };
      }
    };
    return pool;
  },
  format: mysql.format.bind(mysql),
  escape: mysql.escape.bind(mysql),
  escapeId: mysql.escapeId.bind(mysql)
};

var KindaMySQL = {
  create: function() {
    return kindaMySQL;
  }
};

module.exports = KindaMySQL;
