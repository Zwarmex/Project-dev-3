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
			};
			return;
		}

		const pool = await sql.connect(config);
		const idRec = req.query.name;

		// Verify that idRec is not null
		if (!idRec) {
			context.res = {
				status: 400,
				body: 'name parameter is required',
			};
			return;
		}

		// Verify that idRec is a string
		if (typeof idRec !== 'string') {
			context.res = {
				status: 400,
				body: 'name parameter must be a string',
			};
			return;
		}

		const result = await pool
			.request()
			.input('name', sql.VarChar, idRec)
			.query('SELECT * FROM ingredients where nameIng=@name');

		// Verify that result is not null
		if (!result.recordset || result.recordset.length === 0) {
			context.res = {
				status: 404,
				body: `No ingredient found with the specified name ${idRec}`,
			};
			return;
		}

		context.res = {
			status: 200,
			body: result.recordset,
		};
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
