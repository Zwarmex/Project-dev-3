const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
require('dotenv').config();
const { verificationJWT } = require('../jwtFunctionalities.js');

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
				body: 'Database configuration is missing or incomplete',
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
			case 'DELETE':
				await handleDelete(context, req, pool);
				break;
			case 'GET':
				await handleGet(context, req, pool);
				break;
			case 'PUT':
				await handlePut(context, req, pool);
				break;
			default:
				context.res = {
					status: 400,
					body: 'Invalid request method',
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
		}
	} catch (err) {
		context.res = {
			status: 500,
			body: `API Failed : ${err}`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

async function handlePost(context, req, pool) {
	const textOpi = req.body.hasOwnProperty('textOpi') ? req.body.textOpi : null;
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;

	if (!textOpi) {
		context.res = {
			status: 400,
			body: 'textOpi parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.opinionPost(textOpi, idRec, idUser);
	const result = await pool.request().query(query);
	result.rowsAffected[0] >= 1
		? (context.res = {
				status: 200,
				body: 'Opinion added successfully',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  })
		: (context.res = {
				status: result.recordset[0].status,
				body: result.recordset[0].message,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  });
}
async function handleDelete(context, req, pool) {
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;

	const query = queries.opnionDelete(idRec, idUser);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Entry successfully deleted',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Entry not found',
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
			body: 'topValue must be a positive integer.',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.opinionGet(idUser, topValue, lastId);
	const result = await pool.request().query(query);

	context.res = {
		status: 200,
		body: result.recordset,
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
async function handlePut(context, req, pool) {
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const textOpi = req.body.hasOwnProperty('textOpi') ? req.body.textOpi : null;

	if (!textOpi) {
		context.res = {
			status: 400,
			body: 'textOpi parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.opinionPut(idRec, idUser, textOpi);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Opinion updated successfully',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Opinion not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
