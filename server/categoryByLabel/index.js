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
	// The GET handler code goes here
	const labelCat = req.params.labelCat;

	// Verify that labelCat is not null
	if (!labelCat) {
		context.res = {
			status: 400,
			body: 'label parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.categoryGetByLabel(labelCat);
	const result = await pool.request().query(query);

	// Verify that result is not null
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No category found with the specified label ${labelCat}`,
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