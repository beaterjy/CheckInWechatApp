module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Message', {
		message_id: {type: DataTypes.INTEGER, field_id: 'message_id', autoIncrement: true, primaryKey: true, unique: true},
		wechat_id: {type: DataTypes.STRING, field_id: 'wechat_id', unique: true, allowNull: false},
		message: {type: DataTypes.TEXT, field_id: 'message', allowNull: false},
		send_time: {type: DataTypes.STRING, field_id: 'send_time', allowNull: false},
		is_read: {type: DataTypes.INTEGER, field_id: 'is_read', allowNull: false}
	},
	{
		timestamps: false,
		tableName: 'message'
	})
}