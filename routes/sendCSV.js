var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var router = express.Router();
var jsonParser = bodyParser.json()
var isSuccess = false;
var timestamp;
var statuscode = 500;
var statusmessage = 'upload failed';

var cfg = require('./cfg.json');

router.post('/', jsonParser, function(req, res, next) {
	var moment = require('moment');
	var startTime = moment().format('YYYY MM DD HH:mm:ss sss');
	console.log('starting to create file at' + startTime);
	//convert to CSV
	var json = req.body;
	var jobId = json.jobId;
	var fields = json.rows[0];
	//console.log(fields);
	json.rows.shift();
	var allData = json.rows;
	var allDataJoined = [];
	var createTime = moment().format('YYYY MM DD HH:mm:ss');


	var filename = jobId + ' - ' + createTime + '.csv';
	console.log(filename);
	for(i = 0; i < allData.length; i++) {
		allDataJoined.push('\'' + allData[i].join('\',\'') + '\'');
	}
	var cp1252 = require('windows-1252');
	var data = allData.join('\n');
	var encodedData = cp1252.encode(data);
	console.log(encodedData);
   	fs.writeFile(filename, fields + '\n' + encodedData, function(err) {
	   	if(err) {
	   		throw err;
	   		console.log('file not created');
	   	}
   	});
   	console.log('file created at ' + createTime);

   	//upload file
   	var startUpload = moment().format('YYYY MM DD HH:mm:ss sss');
   	console.log('upload started at ' + startUpload);
	var Client = require('ftp');

  	var c = new Client();
    var connectonProperties = {	host: cfg.ftp_host,
  								user: cfg.ftp_credentials[0].user,
  								password: cfg.ftp_credentials[1].pw
	};
	console.log(connectonProperties);
	c.on('ready', function() {
		c.put(cfg.create_dir + filename, filename, function(err) {
	    if (err) {
	    	// var statuscode = c.error();
	    	// if (statuscode == 503) {
	    	// 	statusmessage = 'Service Unavailable';
	    	// } else if(statuscode == 553) {
	    	// 	statusmessage = 'Requested action not taken. File name not allowed.';
	    	// } else if(statuscode == 10054) {
	    	// 	statusmessage = 'Connection reset by peer. The connection was forcibly closed by the remote host.';
	    	// } else if(statuscode == 10060) {
	    	// 	statusmessage = 'Cannot connect to remote server.';
	    	// } else if(statuscode == '10061') {
	    	// 	statusmessage = 'Cannot connect to remote server. The connection is actively refused by the server.';
	    	// } 
	    	res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
	    	c.end();
	    	var failTime = moment().format('YYYY MM DD hh:mm:ss sss');
	    	console.log('upload failed at ' + failTime);
	    } else {
			c.end();
		    isSuccess = true;
		    statuscode = 200;
		    statusmessage = 'upload successfull';
		    timestamp = Math.round((new Date()).getTime() / 1000);
		    var uploadTime = moment().format('YYYY MM DD hh:mm:ss sss');
		    console.log('file uploaded at ' + uploadTime);
	    	res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
	    }
	      
	    });
		
	}); 
	  c.connect(connectonProperties);

});
module.exports = router;