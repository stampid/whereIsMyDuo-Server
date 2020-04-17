import bcrypt from 'bcryptjs';
import { sequelize } from '../../models/index';

import * as memberComponenet from '../component/member';
import * as authServcies from './auth';
import * as redisServices from './redis';
import { throwError } from '../router/decorator';

/**
 * @description 이메일 인증 문자 전송
 * @param {String} email
 * @param {*} redisClient
 */
export const sendEmail = async (email, redisClient) => {
	try {
		const secretWord = authServcies.generateSecret();

		await authServcies.sendMail(email, secretWord);
		await redisServices.setRedisKeyValue(email, secretWord, redisClient);

		return null;
	} catch (err) {
		return throwError(err, 500);
	}
};

/**
 * @description 인증 이메일 문자 검증
 * @param {String} email
 * @param {String} secretWord
 * @param {*} redisClient
 */
export const authEmail = async (email, secretWord, redisClient) => {
	const response = await redisServices.getRedisKeyValue(email, secretWord, redisClient);
	if (response === true) await redisServices.deleteRedisKey(email, redisClient);

	return response;
};

/**
 * @description 계정 생성
 * @param {Object} memberDataParam
 * @param {Object} memberAttributeDataParam
 */
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
