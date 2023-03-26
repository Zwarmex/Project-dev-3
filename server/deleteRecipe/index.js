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

		const nameRec = req.body.name;
		const idUser = parseInt(req.body.idUser);

		// Verify that nameRec is not null and is a string
		if (!nameRec || typeof nameRec !== 'string') {
			context.res = {
				status: 400,
				body: `name parameter is required and must be a string : ${nameRec}, ${req.body}`,
			};
			return;
		}

		// Verify that idUser is a valid integer
		if (isNaN(idUser)) {
			context.res = {
				status: 400,
				body: `idUser parameter is required and must be a valid integer : ${idUser}, ${req.body}`,
			};
			return;
		}

		const result = await pool
			.request()
			.input('name', sql.VarChar(50), nameRec)
			.input('idUser', sql.Int, idUser).query(`
                DELETE TOP(1) FROM recipes
                WHERE nameRec = @name AND idUser = @idUser;
            `);

		if (result.rowsAffected[0] === 0) {
			context.res = {
				status: 404,
				body: 'Recipe not found',
			};
			return;
		}

		context.res = {
			status: 200,
			body: { message: 'Recipe deleted successfully' },
		};
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
