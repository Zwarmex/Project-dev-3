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
		const passwordUser = req.query.password;
		const mailUser = req.query.mail;

		// Execute SQL query
		const result = await pool
			.request()
			.input('password', sql.VarChar, passwordUser)
			.input('mail', sql.VarChar, mailUser)
			.query(
				'SELECT * FROM users WHERE passwordUser=@password and mailUser=@mail'
			);

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
			body: 'Found',
		};
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
