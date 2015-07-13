var express = require('express');
var bodyParser = require('body-parser');
var open = require("open");
var router = express.Router();
var jsonParser = bodyParser.json()

/* GET home page. */
router.post('/', jsonParser, function(req, res, next) {
	var fs = require('fs');
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
	   	if(err) {throw err;}
	   	});
   	console.log('file created');

	res.sendStatus(200);	
	open('http://localhost:3000/upload');

});
module.exports = router;