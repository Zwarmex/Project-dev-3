const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
const hashPassword = require('../hashPassword.js');
const bcrypt = require('bcryptjs');
const { verificationJWT, generateJWT } = require('../jwtFunctionalities.js');
require('dotenv').config();

module.exports = async function (context, req) {
	try {
		const jwtVerificationResult = verificationJWT(req);
		if (jwtVerificationResult) {
			context.res = jwtVerificationResult;
			return;
		}
		if (
			!config ||
			!config.server ||
			!config.database ||
			!config.user ||
			!config.password
		) {
			context.res = {
				status: 500,
				body: {
					message: 'Database configuration is missing or incomplete',
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const pool = await sql.connect(config);

		switch (req.method) {
			case 'PUT':
				await handlePut(context, req, pool);
				break;
			default:
				context.res = {
					status: 405,
					body: {
						message: 'Method not allowed',
					},
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
				break;
		}
	} catch (err) {
		context.res = {
			status: 500,
			body: {
				message: `API Failed : ${err}`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

async function handlePut(context, req, pool) {
	const idUser = +req.params.idUser;
	const passwordUser = req.body.hasOwnProperty('password')
		? req.body.password
		: null;

	if (!passwordUser) {
		context.res = {
			status: 400,
			body: {
				message: 'password parameter is required',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const saltRounds = 10;
	const saltUser = await bcrypt.genSalt(saltRounds);
	const hashedPasswordUser = await hashPassword(passwordUser, saltUser);

	const query = queries.userPutPassword(idUser, hashedPasswordUser, saltUser);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'User successfully updated',
				tokenJWT: tokenJWT,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: 'User not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
