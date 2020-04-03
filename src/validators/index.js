import { validationResult } from 'express-validator/check';
import { throwError } from '../router/decorator';

export const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return throwError(errors.array()[0].msg, 400);
	return next();
};
