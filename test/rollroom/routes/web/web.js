var config = require('../../config');
var utils = require('../../utils/utils');

var web = {
	'get|/': function(req, res, next) {
		res.writeHead(200, {'content-type': 'text/html'});
		res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>抽奖房间号'+'</title></head><body>')
		res.write('hello world! I am yang.<br />' + Date());
		res.end('</body></html>')
	},

	'get|/roll/:id': function(req, res, next) {
		res.writeHead(200, {'content-type': 'text/html'});
		res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>抽奖房间号'+req.params.id+'</title></head><body>')
		res.write('抽奖房间号：' + req.params.id + '<br />');
		//console.log(req);
		res.write('这是一个来自"XXX"微信小程序的二维码，请用小程序扫描<br />');
		res.write('</body></html>')
		res.end();
	},

	'get|/test': function(req, res, next) {
		res.writeHead(200, {'content-type': 'text/html'});
		res.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>抽奖房间号'+'</title></head><body>')
		res.write('Web Pages Test <br />');
		res.write('hello world! I am yang.<br />' + Date());
		res.end('</body></html>')
	}
}

module.exports = web;