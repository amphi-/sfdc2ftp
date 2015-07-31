var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var router = express.Router();
var jsonParser = bodyParser.json()
var isSuccess = false;
var timestamp;
var statuscode = 500;
var statusmessage = 'upload failed';

//bind config file
var cfg = require('./cfg.json');

router.post('/', jsonParser, function(req, res, next) {
	var moment = require('moment');

	//convert to CSV
	var json = req.body;
	var jobId = json.jobId;
	var fields = json.rows[0];
		json.rows.shift();
	var allData = json.rows;
	var allDataJoined = [];
	var createTime = moment.utc().format('YYYYMMDD-HHmmss');

	var filename = jobId + ' - ' + createTime + '.csv';

	for(i = 0; i < allData.length; i++) {
		allDataJoined.push('\'' + allData[i].join('\',\'') + '\'');
	}

	var cp1252 = require('windows-1252');
	var data = allData.join('\n');
	var encodedData = cp1252.encode(data);

	//generate CSV
   	fs.writeFile(filename, fields + '\n' + encodedData, function(err,written,str) {
	   	if(err) {
	   		res.json({ isSuccess: isSuccess, 
							   uploadTimestamp: timestamp, 
							   timezone: cfg.timezone,  
							   endpointStatusCode: statuscode, 
							   endpointStatusMessage: 'couldn\'t create CSV file - upload failed' });
	   	} else {
		   	//prepare file upload
			var Client = require('ftp');
		  	var c = new Client();
		    var connectionProperties = {	host: cfg.ftp_host,
											user: cfg.ftp_user,
											password: cfg.ftp_pw,
											port: cfg.ftp_port
											//secure: true,
											//secureOptions: { rejectUnauthorized: false }
										};
				//upload error
				c.on('error',function(err) {
					timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
					res.json({ isSuccess: isSuccess, 
							   uploadTimestamp: timestamp, 
							   timezone: cfg.timezone,  
							   endpointStatusCode: statuscode, 
							   endpointStatusMessage: statusmessage });
				})
				//upload ready
				c.on('ready', function() {
					c.put('./' + filename, filename, function(err) {
				    if (err) {
				    	c.end();
						timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
				    	res.json({ isSuccess: isSuccess, 
				    			   uploadTimestamp: timestamp, 
				    			   timezone: cfg.timezone, 
				    			   endpointStatusCode: statuscode, 
				    			   endpointStatusMessage: statusmessage });
				    } else {
						c.end();					    				
					    
					    //delete local file after upload
				    	fs.unlink('./' + filename, function (err) {
	  						if (err) {
	  							timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
								res.json({ isSuccess: true, 
										   uploadTimestamp: timestamp, 
										   timezone: cfg.timezone,  
										   endpointStatusCode: 200, 
										   endpointStatusMessage: 'upload successful, but local file deletion failed' });	 						
							} else {
								timestamp = moment.utc().format('YYYY MM DD hh:mm:ss');
								res.json({ 	isSuccess: true, 
								   			uploadTimestamp: timestamp, 
								   			timezone: cfg.timezone,  
								   			endpointStatusCode: 200, 
								   			endpointStatusMessage: 'upload and local file deletion successful' });
							}
						});
				    }
				    });
				}); 
				c.connect(connectionProperties);
	   	}
   	});
});
module.exports = router;