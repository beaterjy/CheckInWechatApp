module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Prizes', {
		prize_id: {type: DataTypes.INTEGER, field_id: 'prize_id', autoIncrement: true, primaryKey: true, unique: true},
		roll_id: {type: DataTypes.INTEGER, field_id: 'roll_id', references: {model: 'rollroom', key: 'roll_id'}, allowNull: false},
		img_url: {type: DataTypes.TEXT, field_id: 'img_url'}
	},
	{
		timestamps: false,
		tableName: 'prizes'
	})
}