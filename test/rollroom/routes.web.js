var express = require('express');
var router = express.Router();
var fs = require('fs');
var files = fs.readdirSync('./routes/web');
var routesall = {};

for (var i = 0; i < files.length; i++) {
    Object.assign(routesall, require('./routes/web/' + files[i]));
}

for (var k in routesall) {
	var root_k = k.split('|');
	if (root_k.length === 2) {
		router[root_k[0]](root_k[1], routesall[k]);
	}
}

module.exports = router;