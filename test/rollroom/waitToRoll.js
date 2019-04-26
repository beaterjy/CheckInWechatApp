var config = require('./config');
var utils = require('./utils/utils');
var sha256 = utils.sha256;
var sequelize = require('./database/sequelize');

const User = sequelize.models.User;
const RollRoom = sequelize.models.RollRoom;
const Prizes = sequelize.models.Prizes;
const Participators = sequelize.models.Participators;
const Win = sequelize.models.Win;
const Exchange = sequelize.Exchange;
const Message = sequelize.models.Message;

var ok = true;

process.on('message', function(msg) {
	if (msg == 'stop') {
		ok = false;
	} else if (msg == 'start') {
		ok = true;
	}
})

while (ok) {
	
}