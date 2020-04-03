import { Member, MemberAttribute } from '../../models/index';

export const createMember = async (memberData, t) => {
	const response = await Member.create(memberData, { transaction: t });
	return response;
};

export const createMemberAttribute = async (memberAttributeData, t) => {
	const response = await MemberAttribute.create(memberAttributeData, { transaction: t });
	return response;
};
