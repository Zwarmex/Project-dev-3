require('dotenv').config();
const jwt = require('jsonwebtoken');
function verificationJWT(req) {
	// JWT Verification
	const token = req.headers.authorization;
	if (!token) {
		return { status: 401, body: 'No token provided.' };
	}

	const secret = process.env.JWT_SECRET;
	try {
		jwt.verify(token, secret);
	} catch (error) {
		return {
			status: 401,
			body: 'Failed to authenticate token.',
		};
	}
}
function generateJWT(mailUser) {
	// generate JWT
	return jwt.sign({ mail: mailUser }, process.env.JWT_SECRET, {
		expiresIn: '1h',
	});
}
module.exports = {
	verificationJWT: verificationJWT,
	generateJWT: generateJWT,
};
