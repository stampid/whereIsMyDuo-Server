import express from 'express';
// import * as firstvalidarots from '../validators/first';
import { doAsync } from './decorator';
import * as memberServices from '../services/member';
import routes from '../routes';

const router = express.Router();

router.post(
	routes.home,
	doAsync(async (req, res) => {
		const memberData = {
			user_id: req.body.user_id,
			password: req.body.password,
			nickname: req.body.nickname,
			join_site: req.body.join_site,
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
