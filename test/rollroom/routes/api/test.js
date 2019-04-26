var api = {
	'get|/test': function(req, res, next) {
		response = {'msg':''};
		console.log("12345");
		response.msg = 'hello world!';
		res.end(JSON.stringify(response));
	}
}

module.exports = api;

