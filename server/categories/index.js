const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');

module.exports = async function (context, req) {
	try {
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
					status: 400,
					body: 'Invalid request method',
				};
		}
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: `API Failed : ${err}`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

async function handleGet(context, req, pool) {
	const topValue = req.query.hasOwnProperty('top') ? +req.query.top : 10;
	const orderValue = req.query.hasOwnProperty('order')
		? req.query.order.toUpperCase()
		: 'IDCAT';
	const sortValue = req.query.hasOwnProperty('sort')
		? req.query.sort.toUpperCase()
		: 'ASC';
	const validOrderValues = ['IDCAT', 'LABELCAT'];
	const validSortValues = ['ASC', 'DESC'];

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
	if (!validOrderValues.includes(orderValue)) {
		context.res = {
			status: 400,
			body: "orderValue must be either 'idCat' or 'labelCat', case insensitive.",
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!validSortValues.includes(sortValue)) {
		context.res = {
			status: 400,
			body: "sortValue must be either 'ASC' or 'DESC', case insensitive.",
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Execute SQL query
	const query = queries.categories(topValue, orderValue, sortValue);
	const result = await pool.request().query(query);

	// Verify that the query was successful
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: 'No records found',
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
