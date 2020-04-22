import express from 'express';
import routes from '../routes';
import member from './member';
import jwt from './jwt';

const router = express.Router();

router.use(routes.member, member);

router.use(routes.auth, jwt);

export default router;
