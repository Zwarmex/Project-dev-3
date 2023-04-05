const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');

module.exports = async function (context, req) {
	context.log('Processing a request for recipe API.');

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
		case 'GET':
			await handleGet(context, req, pool);
			break;
		default:
			context.res = {
				status: 405,
				body: 'Method not allowed',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			break;
	}
};

async function handleGet(context, req, pool) {
	const labelRec = req.params.labelRec;
	const topValue = req.query.top || 10;
	const orderValue = req.query.order || 'idRec';
	const sortValue = req.query.sort || 'ASC';

	// Verify that labelRec is not null
	if (!labelRec) {
		context.res = {
			status: 400,
			body: 'label parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.recipeGetByLabel(
		labelRec,
		topValue,
		orderValue,
		sortValue
	);
	const result = await pool.request().query(query);

	// Verify that result is not null and contains at least one record
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No recipes found with the specified label ${labelRec}`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	context.res = {
		status: 200,
		body: result.recordset,
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
