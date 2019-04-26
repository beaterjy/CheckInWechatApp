module.exports = function(sequelize, DataTypes) {
	return sequelize.define('RollRoom', {
		roll_id: {type: DataTypes.INTEGER, field_id: 'roll_id', autoIncrement: true, primaryKey: true, unique: true},
		title: {type: DataTypes.STRING, field_id: 'title', allowNull: false},
		create_time: {type: DataTypes.STRING, field_id: 'create_time', allowNull: false},
		have_passwd: {type: DataTypes.INTEGER, field_id: 'have_passwd'},
		passwd: {type: DataTypes.STRING, field_id: 'passwd'},
		show_on_list: {type: DataTypes.INTEGER, field_id: 'show_on_list', allowNull: false},
		roll_type: {type: DataTypes.INTEGER, field_id: 'roll_type', allowNull: false},
		time_limit: {type: DataTypes.STRING, field_id: 'time_limit'},
		people_limit: {type: DataTypes.INTEGER, field_id: 'people_limit'},
		selected_mode: {type: DataTypes.INTEGER, field_id: 'selected_mode', allowNull: false},
		roll_desc: {type: DataTypes.TEXT, field_id: 'roll_desc'},
		status: {type: DataTypes.STRING, field_id: 'status', allowNull: false},
		participators_count: {type: DataTypes.INTEGER, field_id: 'participators_count'},
		email: {type: DataTypes.STRING, field_id: 'email', allowNull: false, validate: {isEmail: true}},
		phone: {type: DataTypes.STRING, field_id: 'phone', allowNull: false, validate: {isNumeric: true}},
		creator_avatar: {type: DataTypes.TEXT, field_id: 'creator_avatar', allowNull: false, validate: {isUrl: true}},
		wechat_id: {type: DataTypes.STRING, field_id: 'wechat_id', allowNull: false},
		qrcode_url: {type: DataTypes.STRING, field_id: 'qrcode_url', allowNull: false}
	},
	{
		timestamps: false,
		tableName: 'rollroom'
	});
}