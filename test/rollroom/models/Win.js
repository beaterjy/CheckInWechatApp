module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Win', {
		win_id: {type: DataTypes.INTEGER, field_id: 'win_id', autoIncrement: true, primaryKey: true, unique: true},
		roll_id: {type: DataTypes.INTEGER, field_id: 'roll_id', references: {model: 'rollroom', key: 'roll_id'}, allowNull: false},
		wechat_id: {type: DataTypes.STRING, field_id: 'wechat_id'},
		prize_id: {type: DataTypes.INTEGER, field_id: 'prize_id', references: {model: 'prizes', key: 'prize_id'}, allowNull: false},
		email: {type: DataTypes.STRING, field_id: 'email'},
		phone: {type: DataTypes.STRING, field_id: 'phone'},
		wechat: {type: DataTypes.STRING, field_id: 'wechat'},
		qq: {type: DataTypes.STRING, field_id: 'qq'},
		exchange_code: {type: DataTypes.STRING, field_id: 'exchange_code'},
		exchanged: {type: DataTypes.INTEGER, field_id: 'exchanged'}
	},
	{
		timestamps: false,
		tableName: 'win'
	})
}