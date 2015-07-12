var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var jsonParser = bodyParser.json()

/* GET home page. */
router.post('/', jsonParser, function(req, res, next) {
	// if (!req.body) return res.sendStatus(400);
	var json2csv = require('json2csv');
	var fs = require('fs');
	// var json_raw = req.body;
	// var id = json_raw.jobId;
	// var dataRowsCount = json_raw.dataRowsCount;
	// var fields = json_raw.rows[0];
	// var data = json_raw.rows.shift(0);
	var fields = ['field1', 'field2', 'field3'];
	var myData = [{
		'field1':'text1',
		'field2':'text2',
		'field3':'text3'
	}]
 
	json2csv({ data: myData, fields: fields }, function(err, csv) {
	  	if (err) console.log(err);
  		fs.writeFile('foo.csv', 'some_remote.csv', function(err) {
    	if (err) throw err;
    	console.log('file saved');
  		});
	});
	res.send(200);
});
module.exports = router;