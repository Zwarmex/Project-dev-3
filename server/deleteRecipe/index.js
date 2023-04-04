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
