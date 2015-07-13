var express = require('express');
var router = express.Router();
var isSuccess = false;
var timestamp;
var statuscode = 500;
var statusmessage = 'Upload failed';

/* GET home page. */
router.get('/', function(req, res, next) {
	var Client = require('ftp');
	var fs = require('fs');

  	var c = new Client();
    var connectonProperties = {
	  	host: 'localhost',
	  	user: 'simon',
	  	password: ':Ek00Lbo1!'
  	};
	c.on('ready', function() {
		c.put('/Users/simon/csvhandler/foo.csv', 'foo.remote-copy.csv', function(err) {
	    if (err) throw err + res.sendStatus(500);
	      c.end();
	      timestamp = Math.round((new Date()).getTime() / 1000);
	      console.log(timestamp);
		  console.log(res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage }));
	    });
		
	}); 
	  c.connect(connectonProperties);	
});
module.exports = router;