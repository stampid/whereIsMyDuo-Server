'use strict';

module.exports = (sequelize, DataTypes) => {
	const Member = sequelize.define(
		'Member',
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.BIGINT.UNSIGNED,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.STRING,
				comment: '아이디',
			},
			password: {
				allowNull: false,
				type: DataTypes.STRING,
				comment: '비밀번호',
			},
			nickname: {
				allowNull: false,
				type: DataTypes.STRING,
				comment: '닉네임',
			},
			join_site: {
				allowNull: false,
				type: DataTypes.ENUM('site', 'naver'),
				defaultValue: 'site',
			},
		},
		{
			timestamp: true,
			underscored: true,
			comment: '회원',
		},
	);
	Member.associate = function(models) {
		// associations can be defined here
		Member.hasOne(models.MemberAttribute, { as: 'attribute', foreignKey: 'member_id', sourceKey: 'id', constraints: false });
	};
	return Member;
};
