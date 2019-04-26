var Sequelize = require('sequelize');
var config = require('../config');

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
	host: config.mysql.host,
	dialect: 'mysql',
	pool: {
		max: 20,
		min: 0,
		idle: 10000
	}
});

sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully');
	})
	.catch(err => {
		console.error('Unable to connect to the database: ', err);
	});


const RollRoom = sequelize.import('../models/RollRoom.js');
const Prizes = sequelize.import('../models/Prizes.js');
const Participators = sequelize.import('../models/Participators.js');
const Win = sequelize.import('../models/Win.js');
const User = sequelize.import('../models/User.js');
const Message = sequelize.import('../models/Message.js');




module.exports = sequelize;