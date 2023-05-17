const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
	jwksUri: 'https://your-identity-provider/.well-known/jwks.json', // replace with your JWKS URI
});

function getKey(header, callback) {
	client.getSigningKey(header.kid, function (err, key) {
		let signingKey = key.publicKey || key.rsaPublicKey;
		callback(null, signingKey);
	});
}

async function validateToken(req) {
	if (req.headers && req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1]; // Get the token from the header
		return new Promise((resolve, reject) => {
			jwt.verify(token, getKey, {}, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});
	} else {
		throw new Error('No token found');
	}
}
export default validateToken;
