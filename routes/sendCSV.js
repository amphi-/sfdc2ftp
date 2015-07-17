var express = require('express');
var bodyParser = require('body-parser');
var open = require("open");
var fs = require('fs');
var router = express.Router();
var jsonParser = bodyParser.json()
var isSuccess = false;
var timestamp;
var statuscode = 500;
var statusmessage = 'upload failed';

var data = fs.readFileSync("./cfg.json"), cfg;

try {
	var cfg = JSON.parse(data);
	console.log(cfg);
} catch(err){
	console.log('couldnt read cfg file');
}

/* GET home page. */
router.post('/', jsonParser, function(req, res, next) {
	//convert to CSV
	var moment = require('moment');
	var json = req.body;
	var jobId = json.jobId;
	var fields = json.rows[0];
	console.log(fields);
	json.rows.shift();
	var allData = json.rows;
	var allDataJoined = [];
	var now = moment().format('YYYY MM DD hh:mm:ss');
	console.log(now);

	var filename = jobId + ' - ' + now + '.csv';
	console.log(filename);
	for(i = 0; i < allData.length; i++) {
		allDataJoined.push('\'' + allData[i].join('\',\'') + '\'');
	}

	var data = allData.join('\n');
   	fs.writeFile(filename, fields + '\n' + data, function(err) {
	   	if(err) {
	   		throw err;
	   		console.log('file not created');
	   	}
   	});
   	console.log('file created');

   	//upload file
	var Client = require('ftp');

  	var c = new Client();
    //var connectonProperties = { cfg.host, cfg.user, cfg.password };
    var connectonProperties = {	host: 'localhost',
  								user: 'simon',
  								password: '' 
	};
	c.on('ready', function() {
		c.put('/Users/simon/csvhandler/foo.csv', 'foo.remote-copy.csv', function(err) {
	    if (err) {
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