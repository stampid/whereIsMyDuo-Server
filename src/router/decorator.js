export const doAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

export const throwError = (message, stautsCode) => {
	const err = new Error(message);
	err.status = stautsCode;
	throw err;
};
