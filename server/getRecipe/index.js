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
		const idIng = req.query.id;

		// Verify that idIng is not null
		if (!idIng) {
			context.res = {
				status: 400,
				body: 'id parameter is required',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that idIng is a number
		if (isNaN(idIng)) {
			context.res = {
				status: 400,
				body: 'id parameter must be a number',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool
			.request()
			.input('id', sql.Int, idIng)
			.query('SELECT * FROM recipes where idRec=@id');

		// Verify that result is not null and contains at least one record
		if (!result.recordset || result.recordset.length === 0) {
			context.res = {
				status: 404,
				body: `No recipes found with the specified id ${idIng}`,
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
