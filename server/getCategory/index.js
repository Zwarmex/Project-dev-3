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
		const labelCat = req.query.label;

		// Verify that labelCat is not null
		if (!labelCat) {
			context.res = {
				status: 400,
				body: 'label parameter is required',
			};
			return;
		}

		// Verify that labelCat is a string
		if (typeof labelCat !== 'string') {
			context.res = {
				status: 400,
				body: 'label parameter must be a string',
			};
			return;
		}

		const result = await pool
			.request()
			.input('label', sql.VarChar, labelCat)
			.query('SELECT * FROM categories where labelCat=@label');

		// Verify that result is not null
		if (!result.recordset || result.recordset.length === 0) {
			context.res = {
				status: 404,
				body: `No category found with the specified name ${labelCat}`,
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
