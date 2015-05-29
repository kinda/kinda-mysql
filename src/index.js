'use strict';

let mysql = require('mysql');
let KindaObject = require('kinda-object');

let KindaMySQL = KindaObject.extend('KindaMySQL', function() {
  this.createPool = function(options) {
    let mysqlPool = mysql.createPool(options);

    let pool = {
      getConnection() {
        return function(cb) {
          mysqlPool.getConnection(function(err, mysqlConnection) {
            if (err) return cb(err);
            let connection = {
              query(sql, values) {
                return function(queryCb) {
                  mysqlConnection.query(sql, values, function(queryErr, res) {
                    queryCb(queryErr, res);
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

      query(sql, values) {
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

      end() {
        return function(cb) {
          mysqlPool.end(cb);
        };
      }
    };
    return pool;
  };

  this.format = mysql.format.bind(mysql);

  this.escape = mysql.escape.bind(mysql);

  this.escapeId = mysql.escapeId.bind(mysql);
});

module.exports = KindaMySQL;
