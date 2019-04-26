module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User', {
		wechat_id: {type: DataTypes.STRING, field_id: 'wechat_id', primaryKey: true, unique: true, allowNull: false},
		nickname: {type: DataTypes.STRING, field_id: 'nickname', allowNull: false},
		avatar_url: {type: DataTypes.TEXT, field_id: 'avatar_url', allowNull: false, validate: {isUrl: true}},
		last_login_time: {type: DataTypes.STRING, field_id: 'last_login_time', allowNull: false},
		session_code: {type: DataTypes.STRING, field_id: 'session_code'}
	},
	{
		timestamps: false,
		tableName: 'user'
	})
}