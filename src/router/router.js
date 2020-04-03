import express from 'express';
import routes from '../routes';
import member from './member';

const router = express.Router();

router.use(routes.member, member);

export default router;
