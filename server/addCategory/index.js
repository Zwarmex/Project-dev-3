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
		const labelCat = req.body.label;

		// Verify that label is not null and is a string
		if (!labelCat || typeof labelCat !== 'string') {
			context.res = {
				status: 400,
				body: 'label parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool.request().input('label', sql.VarChar, labelCat)
			.query(`
        BEGIN TRY
          INSERT INTO categories (labelCat) values (@label);
        END TRY
        BEGIN CATCH
          IF ERROR_NUMBER() = 2627
          BEGIN
            SELECT 'Error: The category already exists' as message;
          END
          ELSE
          BEGIN
            SELECT 'Error: Failed to execute query' as message;
          END
        END CATCH
      `);

		result.recordsets.length > 0
			? (context.res = {
					status: 409,
					body: { message: result.recordset[0] },
			  })
			: (context.res = {
					status: 200,
					body: { message: 'Category added successfully' },
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
			  });
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
