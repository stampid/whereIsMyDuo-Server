import express from 'express';
import { doAsync, throwError } from './decorator';
import * as memberServices from '../services/member';
import * as redisServices from '../services/redis';
import * as jwt from '../services/jwt';

const router = express.Router();

/** @description 닉네임 중복 확인 */
router.get(
	'/nickname/exist',
	doAsync(async (req, res) => {
		console.log(req.query);
		const response = await memberServices.nicknameExist(req.query.nickname);

		return res.json(response);
	}),
);

/** @description 인증 이메일 전송 */
router.post(
	'/email',
	doAsync(async (req, res) => {
		const response = await memberServices.sendEmail(req.body.email);

		return res.json(response);
	}),
);

/** @description 인증 이메일 문자 검증 */
router.post(
	'/email/verify',
	doAsync(async (req, res) => {
		const response = await memberServices.authEmail(req.body.email, req.body.secretWord);

		return res.json(response);
	}),
);

/** @description site 회원 가입 */
router.post(
	'/',
	doAsync(async (req, res) => {
		const memberData = {
			user_id: req.body.userId,
			password: req.body.password,
			nickname: req.body.nickname,
			join_site: 'site',
		};
		const memberAttributeData = {
			email: req.body.email,
			play_time: req.body.playTime,
		};
		const member = await memberServices.createMemberAccount(memberData, memberAttributeData);

		return res.json(member);
	}),
);

router.post(
	'/login',
	doAsync(async (req, res) => {
		const memberData = { user_id: req.body.userId, password: req.body.password };
		const member = await memberServices.memberLogin(memberData);

		if (!member) return throwError('Invalid Member', 400);

		const token = await jwt.generateToken({ member_id: member.id });

		return res.json(token);
	}),
);

router.post(
	'/logout',
	doAsync(async (req, res) => {
		const accessToken = await jwt.decodeAccessToken(req.headers['x-access-token']);

		await redisServices.deleteRedisKey(accessToken.data.member.member_id);

		return res.json(null);
	}),
);

export default router;
