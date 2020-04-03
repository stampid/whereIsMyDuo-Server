'use strict';

module.exports = (sequelize, DataTypes) => {
	const MemberAttribute = sequelize.define(
		'MemberAttribute',
		{
			member_id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.BIGINT.UNSIGNED,
			},
			email: {
				allowNull: true,
				defaultValue: null,
				type: DataTypes.STRING,
			},
			play_time: {
				allowNull: false,
				defaultValue: '1',
				type: DataTypes.ENUM('1', '2', '3', '4', '5', '6'),
			},
		},
		{
			timestamp: true,
			underscored: true,
			comment: '회원 기본 정보',
		},
	);
	MemberAttribute.associate = function(models) {
		// associations can be defined here
		MemberAttribute.belongsTo(models.Member, { as: 'member', foreginKey: 'member_id', targetKey: 'id', constraints: false });
	};
	return MemberAttribute;
};
