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

		// Execute SQL query
		const result = await pool.request().query('SELECT * FROM recipes');

		// Verify that the query was successful
		if (!result.recordset || result.recordset.length === 0) {
			context.res = {
				status: 404,
				body: 'No records found',
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
			body: `API Failed : ${err}`,
		};
	}
};
