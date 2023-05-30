const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
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
			case 'POST':
				await handlePost(context, req, pool);
				break;
			case 'GET':
				await handleGet(context, req, pool);
				break;
			case 'DELETE':
				await handleDelete(context, req, pool);
				break;
			default:
				context.res = {
					status: 400,
					body: {
						message: 'Invalid request method',
					},
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
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

async function handlePost(context, req, pool) {
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const idFriend = req.body.hasOwnProperty('idFriend')
		? +req.body.idFriend
		: null;

	if (!idFriend) {
		context.res = {
			status: 400,
			body: {
				message: `idFriend parameter is required`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!Number.isInteger(idFriend) || idFriend <= 0) {
		context.res = {
			status: 400,
			body: {
				message: `idFriend parameter must be a positive integer`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (idUser === idFriend) {
		context.res = {
			status: 400,
			body: {
				message: `Friend id not acceptable`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}

	const query = queries.friendPost(idUser, idFriend);
	const result = await pool.request().query(query);

	if (result.recordsets.length > 0) {
		context.res = {
			status: 409,
			body: {
				message: result.recordset[0],
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'Friend added successfully',
				tokenJWT: tokenJWT,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleDelete(context, req, pool) {
	// The DELETE handler code goes here
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const idFriend = req.params.hasOwnProperty('idFriend')
		? +req.params.idFriend
		: null;

	const query = queries.friendDelete(idUser, idFriend);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'Friend successfully deleted',
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
				message: 'Friend not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const topValue = req.query.hasOwnProperty('top') ? +req.query.top : 10;
	const lastId = req.query.hasOwnProperty('lastId') ? +req.query.lastId : 0;

	if (!Number.isInteger(topValue) || topValue <= 0) {
		context.res = {
			status: 400,
			body: {
				message: 'topValue must be a positive integer.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.friendGet(idUser, topValue, lastId);
	const result = await pool.request().query(query);

	const tokenJWT = generateJWT(idUser);

	context.res = {
		status: 200,
		body: {
			result: result.recordset,
			tokenJWT: tokenJWT,
		},
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
