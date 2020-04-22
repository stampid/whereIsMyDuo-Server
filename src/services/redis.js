import redis from 'redis';
import { throwError } from '../router/decorator';

const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
});

/**
 * @description redis 정보 저장
 * @param {String} key
 * @param {*} value
 * @param {*} redisClient
 */
export const setRedisKeyValue = async (keyParam, valueParam) => {
	const value = JSON.stringify(valueParam);
	const key = JSON.stringify(keyParam);
	await redisClient.set(key, value);
	return null;
};

/**
 * @description 이메일 인증 문자 검증
 * @param {String} key
 * @param {String} secretWord
 * @param {*} redisClient
 */
export const getRedisKeyValue = (key, secretWord) => {
	return new Promise((resolve, _) => {
		redisClient.get(key, (err, value) => {
			if (err) return throwError(err, 500);
			if (value !== secretWord) return resolve(false);

			return resolve(true);
		});
	});
};

export const getRedisValue = (keyParam) => {
	const key = JSON.stringify(keyParam);
	return new Promise((resolve, _) => {
		redisClient.get(key, (err, value) => {
			if (err) return throwError(err, 500);

			return resolve(value);
		});
	});
};

/**
 * @description redis key value 삭제
 * @param {String} key
 * @param {*} redisClient
 */
export const deleteRedisKey = async (key) => {
	await redisClient.del(key);

	return null;
};
