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
	var startTime = moment.utc().format('YYYY MM DD HH:mm:ss sss');
	console.log('starting to create file at' + startTime);
	//convert to CSV
	var json = req.body;
	var jobId = json.jobId;
	var fields = json.rows[0];
	//console.log(fields);
	json.rows.shift();
	var allData = json.rows;
	var allDataJoined = [];
	var createTime = moment.utc().format('YYYYMMDD-HHmmss');

	var filename = jobId + ' - ' + createTime + '.csv';
	console.log(filename);
	for(i = 0; i < allData.length; i++) {
		allDataJoined.push('\'' + allData[i].join('\',\'') + '\'');
	}
	var cp1252 = require('windows-1252');
	var data = allData.join('\n');
	var encodedData = cp1252.encode(data);
	console.log(encodedData);

	// remove generated file after upload
   	fs.writeFile(filename, fields + '\n' + encodedData, function(err,written,str) {

   		// generate CSV
   		// TODO: return as error 
	   	if(err) {
	   		throw err;
	   		console.log('file not created');
	   	} else {
		   	console.log('file created at ' + createTime);

		   	//upload file
		   	var startUpload = moment.utc().format('YYYYMMDDHHmmsssss');

				var Client = require('ftp');
		  	var c = new Client();
		    var connectonProperties = {	host: cfg.ftp_host,
		  															user: cfg.ftp_credentials.user,
		  															password: cfg.ftp_credentials.pw
				};

				c.on('error',function(err) {
					console.log('upload failed');
					console.log(err);
					timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
					res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, timezone: cfg.timezone,  endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
				})
				c.on('ready', function() {
					c.put(cfg.create_dir + filename, filename, function(err) {
				    if (err) {
				    	c.end();
							timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
				    	res.json({ isSuccess: isSuccess, uploadTimestamp: timestamp, timezone: cfg.timezone, endpointStatusCode: statuscode, endpointStatusMessage: statusmessage });
				    	console.log('upload failed at ' + failTime);
				    	console.log(err);
				    } else {
							c.end();					    					    
					    var uploadTime = moment.utc().format('YYYY MM DD hh:mm:ss');
					    console.log('file uploaded at ' + uploadTime);
				    	fs.unlink(cfg.create_dir + filename, function (err) {
	  						if (err) {
	  							console.log('removal failed');
	  							timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
									res.json({ isSuccess: true, uploadTimestamp: timestamp, timezone: cfg.timezone,  endpointStatusCode: 200, endpointStatusMessage: 'upload successful, but local file deletion failed' });	 						
								}
							timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
							res.json({ isSuccess: true, uploadTimestamp: timestamp, timezone: cfg.timezone,  endpointStatusCode: 200, endpointStatusMessage: 'upload and local file deletion successful' });	 						
							});
				    }
				    });
				}); 
				c.connect(connectonProperties);
	   	}
   	});
});
module.exports = router;