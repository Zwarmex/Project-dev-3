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
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const topValue = req.query.top || 10;
		const orderValue = req.query.order || 'idIng';
		const sortValue = req.query.sort || 'ASC';

		const pool = await sql.connect(config);

		const query = queries.ingredients(topValue, orderValue, sortValue);

		const result = await pool.request().query(query);

		// Verify that result is not null
		if (!result.recordset || result.recordset.length === 0) {
			context.res = {
				status: 404,
				body: `No ingredients found`,
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