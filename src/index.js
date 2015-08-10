'use strict';

let mysql = require('mysql');
let KindaObject = require('kinda-object');

let KindaMySQL = KindaObject.extend('KindaMySQL', function() {
  this.createPool = function(options) {
    let mysqlPool = mysql.createPool(options);

    let pool = {
      getConnection() {
        return new Promise(function(resolve, reject) {
          mysqlPool.getConnection(function(err, mysqlConnection) {
            if (err) {
              reject(err);
              return;
            }
            let connection = {
              query(sql, values) {
                return new Promise(function(queryResolve, queryReject) {
                  mysqlConnection.query(sql, values, function(queryErr, res) {
                    if (queryErr) queryReject(queryErr); else queryResolve(res);
                  });
                });
              },
              format: mysql.format.bind(mysql),
              escape: mysql.escape.bind(mysql),
              escapeId: mysql.escapeId.bind(mysql),
              release: mysqlConnection.release.bind(mysqlConnection)
            };
            resolve(connection);
          });
        });
      },

      query(sql, values) {
        return new Promise(function(resolve, reject) {
          mysqlPool.query(sql, values, function(err, res) {
            if (err) reject(err); else resolve(res);
          });
        });
      },

      on: mysqlPool.on.bind(mysqlPool),

      format: mysql.format.bind(mysql),

      escape: mysql.escape.bind(mysql),

      escapeId: mysql.escapeId.bind(mysql),

      end() {
        return new Promise(function(resolve, reject) {
          mysqlPool.end(function(err, res) {
            if (err) reject(err); else resolve(res);
          });
        });
      }
    };
    return pool;
  };

  this.format = mysql.format.bind(mysql);

  this.escape = mysql.escape.bind(mysql);

  this.escapeId = mysql.escapeId.bind(mysql);
});

module.exports = KindaMySQL;
