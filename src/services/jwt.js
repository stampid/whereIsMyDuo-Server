import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as redis from './redis';
import { throwError } from '../router/decorator';

/**
 * @description 액세스 토큰 검증
 * @param {String} token
 * @param {Boolean} refresh
 */
export const decodeAccessToken = (token, refresh = false) => {
	return new Promise((resolve, reject) => {
		if (!refresh) {
			jwt.verify(token, process.env.JWT_AC_SECRET, (err, decoded) => {
				if (err) return throwError('Invalid Token', 400);
				return resolve(decoded);
			});
		}
		return resolve(jwt.decode(token));
	});
};

/**
 * @description 리프레쉬 토큰 검증
 * @param {String} token
 */
export const decodeRefreshToken = (token) => {
	return new Promise((resolve, _) => {
		jwt.verify(token, process.env.JWT_RE_SECRET, (err, decoded) => {
			if (err) return throwError('Invalid Token', 400);
			return resolve(decoded);
		});
	});
};

/**
 * @description 액세스 토큰 생성
 * @param {Object} payload
 */
export const encodeAccessToken = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_AC_SECRET,
			{
				expiresIn: process.env.JWT_AC_EXP_TIME,
				issuer: process.env.JWT_ISSUER,
			},
			(err, token) => {
				if (err) return reject(err);
				return resolve(token);
			},
		);
	});
};

/**
 * @description 리프레쉬 토큰 생성
 * @param {Object} payload
 */
export const encodeRefreshToken = (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_RE_SECRET,
			{
				expiresIn: process.env.JWT_RE_EXP_TIME,
				issuer: process.env.JWT_ISSUER,
			},
			(err, token) => {
				if (err) return reject(err);
				return resolve(token);
			},
		);
	});
};

/**
 * @description 토큰 발급
 * @param {Object} data
 */
export const generateToken = async (payloadData) => {
	const uniqueId = uuidv4();
	const payload = { data: { member: payloadData }, uniqueId };
	const accessToken = await encodeAccessToken(payload);
	const refreshToken = await encodeRefreshToken(payload);
	const decodeToken = await decodeAccessToken(accessToken);

	await redis.setRedisKeyValue(payloadData.member_id, { ac_token: accessToken, re_token: refreshToken });

	return { token: { ac_token: accessToken, re_token: refreshToken, decode_token: decodeToken } };
};

/**
 * @description 토큰 갱신
 * @param {String} acToken
 * @param {String} reToken
 */
export const refreshToken = async (acToken, reToken) => {
	const decodeAcToken = await decodeAccessToken(acToken, true);
	const { data } = decodeAcToken;
	const redisToken = await redis.getRedisValue(data.member.member_id);
	let response = null;

	if (acToken === redisToken.ac_token && reToken === redisToken.re_token) {
		await decodeRefreshToken(redisToken.re_token);
		const payload = data;
		const newAccessToken = await encodeAccessToken(payload);

		await redis.setRedisKeyValue(data.member.member_id, { ac_token: newAccessToken, re_token: redisToken.re_token });

		response = newAccessToken;
	}

	return response;
};
