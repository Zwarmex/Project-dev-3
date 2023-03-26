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

		const nameIng = req.query.name;

		// Verify that nameIng is not null
		if (!nameIng) {
			context.res = {
				status: 400,
				body: 'name parameter is required',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that nameIng is a string
		if (typeof nameIng !== 'string') {
			context.res = {
				status: 400,
				body: 'name parameter must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool
			.request()
			.input('name', sql.VarChar, nameIng)
			.query('DELETE TOP(1) FROM ingredients where nameIng=@name');

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
