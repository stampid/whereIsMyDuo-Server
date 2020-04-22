import express from 'express';
import { doAsync, throwError } from './decorator';
import * as jwt from '../services/jwt';

const router = express.Router();

/** @description 토큰 갱신 */
router.get(
	'/token/refresh',
	doAsync(async (req, res) => {
		const accessToken = req.headers['x-access-token'];
		const RefreshToken = req.headers['x-refresh-token'];

		const response = await jwt.refreshToken(accessToken, RefreshToken);

		return res.json(response);
	}),
);

export default router;
