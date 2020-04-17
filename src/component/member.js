import { Member, MemberAttribute } from '../../models/index';

/**
 * @description 회원 정보 생성
 * @param {Object} memberData
 * @param {*} t
 */
export const createMember = async (memberData, t) => {
	const response = await Member.create(memberData, { transaction: t });
	return response;
};

/**
 * @description 회원 기본 정보 생성
 * @param {Object} memberAttributeData
 * @param {*} t
 */
export const createMemberAttribute = async (memberAttributeData, t) => {
	const response = await MemberAttribute.create(memberAttributeData, { transaction: t });
	return response;
};

export const memberLogin = async (userId) => {
	const response = await Member.findOne({ where: { user_id: userId }, attributes: ['id', 'user_id', 'password'] });
	return response;
};
