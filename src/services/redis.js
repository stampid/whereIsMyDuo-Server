import { throwError } from '../router/decorator';

/**
 * @description redis 정보 저장
 * @param {String} key
 * @param {*} value
 * @param {*} redisClient
 */
export const setRedisKeyValue = async (key, value, redisClient) => {
	await redisClient.set(key, value);
	return null;
};

/**
 * @description 이메일 인증 문자 검증
 * @param {String} key
 * @param {String} secretWord
 * @param {*} redisClient
 */
export const getRedisKeyValue = (key, secretWord, redisClient) => {
	return new Promise((resolve, _) => {
		redisClient.get(key, (err, value) => {
			if (err) return throwError(err, 500);

			if (value !== secretWord) return resolve(false);

			return resolve(true);
		});
	});
};

/**
 * @description redis key value 삭제
 * @param {String} key
 * @param {*} redisClient
 */
export const deleteRedisKey = async (key, redisClient) => {
	await redisClient.del(key);

	return null;
};
