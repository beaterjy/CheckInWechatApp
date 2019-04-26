//Author: Yang dragon2tech@163.com

var https = require('https');
var config = require('../config');
var crypto = require('crypto');
var QRCode = require('qrcode');
var seedrandom = require('seedrandom');
var RandExp = require('randexp');
var sequelize = require('../database/sequelize');

var that = this;
const User = sequelize.models.User;
const Win = sequelize.models.Win;
const randexp = new RandExp(/^[a-zA-Z0-9]{8}$/);

var cache = {};
Win.findAll({
	where: {
		exchange_code: {$and: {$ne: null, $ne: ''}},
		exchanged: 0,
	}
}).then(function(wins) {
	for (var i = 0; i < wins.length; i++) {
		cache[String(wins.exchange_code)] = 1;
	}
});

exports.sha256 = function (str) {
	console.log(typeof str)
	if (typeof str === 'string') {
		return crypto.createHash('sha256').update(str).digest('hex').toUpperCase();
	}
	else {
		//throw new Error('sha256() require a string');
		console.log('sha256() require a string');
		return null;
	}
}

exports.md5 = function (str) {
	console.log(typeof str)
	if (typeof str === 'string') {
		return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
	}
	else {
		//throw new Error('sha256() require a string');
		console.log('md5() require a string');
		return null;
	}
}

exports.randomInt = function(num) {
	var rng = seedrandom();
	return Math.floor(rng() * num);
},

exports.listAttr = function(array, attr) {
	if (Array.isArray(array) != true || attr == undefined || attr == null || attr == '')
		return null

	var temp = [];
	for (var i = 0; i < array.length; i++) {
		temp.push(array[i][attr]);
	}
	return temp;
}

exports.wx_code_to_userid = function(code, myfunc) {
	https.get(config.codeToSession_key+
		'?appid='+config.AppID+
		'&secret='+config.AppSecret+
		'&js_code='+code+
		'&grant_type=authorization_code', (res) => {
			res.on('data', (d) => {
				var id;
				console.log('https data: '+d.toString('utf-8'));
				var d = JSON.parse(d.toString('utf-8'));
				console.log(d.openid);
				console.log(typeof d.openid)
				if ((typeof d.openid) === 'undefined' || (typeof d.openid) == '') {
					id = null;
				} else {
					console.log(d['session_key']);
					id = d['openid'];
					console.log('openid: '+id);
					var sha256 = require('crypto').createHash('sha256');
					sha256.update(id);
					console.log(sha256.digest('hex'));
				}
				
				if (myfunc && typeof myfunc === 'function')
					myfunc(id);
				return id;
			});
			res.on('error', (e) => {
				console.log(e);
				var id = null;
				if (myfunc && typeof myfunc === 'function')
					myfunc(id);
				return id;
			});
	});
}

exports.generateQRCodeImage = function(text, cb) {
	var filename = new Date().getTime() + this.md5(text)+'.png';
	QRCode.toFile('./public/images/rolls_qrcode/' + filename, text, {
		version: config.qrcode.version,
		errorCorrectionLevel: config.qrcode.errorCorrectionLevel,
		margin: config.qrcode.margin
	}, function(err) {
		if (err)
			cb(err);
		else
			cb(err, config.server_url + '/images/rolls_qrcode/' + filename);
	});
}

exports.generateExchangeCode = function() {
	console.log(cache);
	var code = randexp.gen();
	while (cache[code] == 1) {
		code = randexp.gen();
	}
	return code;
}

exports.createSessionCode = function(wechat_id) {
	return this.sha256(new Date().getTime() + config.secret_code + wechat_id + randexp.gen());
}

exports.checkSessionCode = function(session_code, cb) {
	User.findOne({
		where: {
			session_code: session_code
		}
	}).then(cb(user));
}