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

		const nameIng = req.body.name;

		// Verify that nameIng is not null and is a string
		if (!nameIng || typeof nameIng !== 'string') {
			context.res = {
				status: 400,
				body: `name parameter is required and must be a string : ${nameIng}`,
			};
			return;
		}

		const result = await pool.request().input('name', sql.VarChar, nameIng)
			.query(`
                BEGIN TRY
                    INSERT INTO ingredients (nameIng) values (@name);
                END TRY
                BEGIN CATCH
                    IF ERROR_NUMBER() = 2627
                    BEGIN
                        SELECT 'Error: The ingredient name already exists' as message;
                    END
                    ELSE
                    BEGIN
                        SELECT 'Error: Failed to execute query' as message;
                    END
                END CATCH
            `);

		result.recordset.length > 0
			? (context.res = {
					status: 409,
					body: { message: result.recordset[0] },
			  })
			: (context.res = {
					status: 200,
					body: { message: 'Ingredient added successfully' },
			  });
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
