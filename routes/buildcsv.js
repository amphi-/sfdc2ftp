var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var json2csv = require('json2csv');
	var fs = require('fs');
	var json = 
	var fields = ['field1', 'field2', 'field3'];
	var myData = [{
		'field1':'text1',
		'field2':'text2',
		'field3':'text3'
	}]
 
	json2csv({ data: myData, fields: fields }, function(err, csv) {
	  	if (err) console.log(err);
  		fs.writeFile('../foo.csv', csv, function(err) {
    	if (err) throw err;
    	console.log('file saved');
  		});
	});
});

module.exports = router;
