import express from 'express';
import { doAsync } from './decorator';
import * as memberServices from '../services/member';
import routes from '../routes';

const router = express.Router();

/** @description 인증 이메일 전송 */
router.post(
	'/email',
	doAsync(async (req, res) => {
		const response = await memberServices.sendEmail(req.body.email, req.redis_client);

		return res.json(response);
	}),
);

/** @description 인증 이메일 문자 검증 */
router.post(
	'/email/verify',
	doAsync(async (req, res) => {
		const response = await memberServices.authEmail(req.body.email, req.body.secret_word, req.redis_client);

		return res.json(response);
	}),
);

/** @description site 회원 가입 */
router.post(
	routes.home,
	doAsync(async (req, res) => {
		const memberData = {
			user_id: req.body.user_id,
			password: req.body.password,
			nickname: req.body.nickname,
			join_site: 'site',
		};
		const memberAttributeData = {
			email: req.body.email,
			play_time: req.body.play_time,
		};
		const member = await memberServices.createMemberAccount(memberData, memberAttributeData);

		return res.json(member);
	}),
);

export default router;
