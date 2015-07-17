var express = require('express');
var router = express.Router();
var isSuccess = false;
var timestamp;
var statuscode = 500;
var statusmessage = 'upload failed';

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
	    if (err) {
	    	//throw err;
	    	statuscode = c.error();
	    	if (statuscode == 503) {
	    		statusmessage = 'Service Unavailable';
	    	} else if(statuscode == 553) {
	    		statusmessage = 'Requested action not taken. File name not allowed.';
	    	} else if(statuscode == 10054) {
	    		statusmessage = 'Connection reset by peer. The connection was forcibly closed by the remote host.';
	    	} else if(statuscode == 10060) {
	    		statusmessage = 'Cannot connect to remote server.';
	    	} else if(statuscode == '10061') {
	    		statusmessage = 'Cannot connect to remote server. The connection is actively refused by the server.';
	    	} 
	    	res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
	    	c.end();
	    } else {
			c.end();
		    isSuccess = true;
		    statuscode = 200;
		    statusmessage = 'upload successfull';
		    timestamp = Math.round((new Date()).getTime() / 1000);
		    // console.log(timestamp);
	    	res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
	    }
	      
	    });
		
	}); 
	  c.connect(connectonProperties);	
});
module.exports = router;