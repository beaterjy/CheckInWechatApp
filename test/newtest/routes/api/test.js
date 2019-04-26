var api = {
	'get|/test': function(req, res, next) {
		response = {'msg':''};
		console.log("123");
		response.msg = 'hello world!';
		res.end(JSON.stringify(response));
	}
}

module.exports = api;

