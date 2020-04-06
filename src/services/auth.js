import nodemailer from 'nodemailer';
import { adjectives, nouns } from '../util/EmailWord';

/** @description 인증 문자 생성 */
export const generateSecret = () => {
	const randomNumber = Math.floor(Math.random() * adjectives.length);
	return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

/**
 * @description 인증 이메일 전송
 * @param {String} email
 * @param {String} secret
 */
export const sendMail = (email, secret) => {
	const transport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

	const options = { from: 'test@gmail.com', to: email, subject: 'SIGNUP EMAIL AUTH', html: `SIGNUP SECRET WORD ${secret}` };

	return new Promise((resolve, reject) => {
		transport.sendMail(options, (err, info) => {
			if (err) return reject(err);

			return resolve(info);
		});
	});
};
