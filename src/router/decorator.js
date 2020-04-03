export const doAsync = (fn) => async (req, res, next) => {
	try {
		await fn(req, res, next);
	} catch (err) {
		next(err);
	}
};

export const throwError = (message, stautsCode) => {
	const err = new Error(message);
	err.status = stautsCode;

	throw err;
};
