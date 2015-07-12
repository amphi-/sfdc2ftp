var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
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
	    if (err) throw err;
	      c.end();
	    });
	    var uploadTimestamp = c.lastMod();
	    return res.send(uploadTimestamp);
	}); 
	  c.connect(connectonProperties);
});

module.exports = router;
