var express = require('express');
var bodyParser = require('body-parser');
var open = require("open");
var router = express.Router();
var jsonParser = bodyParser.json()

/* GET home page. */
router.post('/', jsonParser, function(req, res, next) {
	var json2csv = require('json2csv');
	var fs = require('fs');
	var json = req.body;

	try {
		var id = json.jobId;
		var dataRowsCount = json.dataRowsCount;
		var fields = json.rows[0];
		json.rows.shift();
		var allData = json.rows;
		console.log(json.jobId);
		console.log(fields);
		console.log(allData);
	} catch(e) {
		console.log(json.jobId);
		console.log(e);
	}
 
	json2csv({ data:allData, fields:fields}, function(err, csv) {
	  	if (err) console.log(err);
  		fs.writeFile('foo.csv', csv, function(err) {
    	if (err) throw err + res.sendStatus(500);
    	console.log('file created');
    	res.sendStatus(200);
		open('http://localhost:3000/upload');
  		});
	});
});
module.exports = router;