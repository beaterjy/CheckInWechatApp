module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Participators', {
		participator_id: {type: DataTypes.INTEGER, field_id: 'participator_id', primaryKey: true, autoIncrement: true},
		roll_id: {type: DataTypes.INTEGER, field_id: 'roll_id', references: {model: 'rollroom', key: 'roll_id'}},
		wechat_id: {type: DataTypes.STRING, field_id: 'wechat_id', allowNull: false},
		avatar_url: {type: DataTypes.TEXT, field_id: 'avatar_url', validate: {isUrl: true}},
		time: {type: DataTypes.STRING, field_id: 'time'}
	},
	{
		timestamps: false,
		tableName: 'participators'
	})
}