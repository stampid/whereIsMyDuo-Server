import bcrypt from 'bcryptjs';
import { sequelize } from '../../models/index';

import * as memberComponenet from '../component/member';

export const createMemberAccount = async (memberDataParam, memberAttributeDataParam) => {
	const memberData = memberDataParam;
	const memberAttributeData = memberAttributeDataParam;

	let response = null;
	let member = null;
	let memberAttribute = null;

	memberData.password = bcrypt.hashSync(memberDataParam.password, parseInt(process.env.HASH_SALT, 10));

	await sequelize.transaction(async (t) => {
		member = await memberComponenet.createMember(memberData, t);

		if (member && member.id) {
			memberAttributeData.member_id = member.id;
			memberAttribute = await memberComponenet.createMemberAttribute(memberAttributeData, t);
		}
		response = { member, member_attribute: memberAttribute };
	});

	return response;
};

export const etc = async () => {};
