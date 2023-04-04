const sql = require('mssql');
const config = require('../config.js');

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

		const pool = await sql.connect(config);

		const labelCat = req.query.label;

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

		// Verify that labelCat is a string
		if (typeof labelCat !== 'string') {
			context.res = {
				status: 400,
				body: 'label parameter must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool
			.request()
			.input('label', sql.VarChar, labelCat)
			.query('DELETE TOP(1) FROM recipes where labelCat=@label');

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
