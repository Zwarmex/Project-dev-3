const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
require('dotenv').config();

module.exports = async function (context, req) {
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
		case 'GET':
			await handleGet(context, req, pool);
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
};

async function handleGet(context, req, pool) {
	const topValue = req.query.hasOwnProperty('top') ? +req.query.top : 10;
	const lastId = req.query.hasOwnProperty('lastId') ? +req.query.lastId : 0;
	const idCat = req.query.hasOwnProperty('idCat') ? +req.query.idCat : null;

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
	if (idCat !== null && (!Number.isInteger(idCat) || idCat <= 0)) {
		context.res = {
			status: 400,
			body: {
				message: 'idCat must be a positive integer.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Execute SQL query
	const query = queries.recipes(topValue, lastId, idCat);
	const result = await pool.request().query(query);

	context.res = {
		status: 200,
		body: {
			result: result.recordset,
		},
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
