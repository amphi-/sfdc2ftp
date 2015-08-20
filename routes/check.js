/**
 * Route for checking server status
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

var cfg = require('./cfg.json');

/* Confirms that node server is responding. */
router.get('/server', function(req, res, next) {
  res.send('connected to NodeJS');
});


/* Checks FTP connection. */
router.get('/ftp', function(req, res, next) {

  var Client = require('ftp');
    var c = new Client();
    var connectionProperties = {  host: cfg.ftp_host,
                  user: cfg.ftp_user,
                  password: cfg.ftp_pw,
                  port: cfg.ftp_port
                  //secure: true,
                  //secureOptions: { rejectUnauthorized: false }
                };

        c.on('error',function(err) {
          res.send('Failed with : '+ err.code + ' - ' + err )
        })

        c.on('ready', function() {
          res.send('connected to FTP');
        });
    c.connect(connectionProperties);

});

module.exports = router;