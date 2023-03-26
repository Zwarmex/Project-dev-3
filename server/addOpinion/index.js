const sql = require('mssql');
const config = require('../config.js');
require('dotenv').config();

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

		const textOpi = req.body.name;
		const idRec = parseInt(req.body.idRec);
		const idUser = parseInt(req.body.idUser);

		// Verify that nameIng is not null and is a string
		if (!textOpi || typeof textOpi !== 'string') {
			context.res = {
				status: 400,
				body: `name parameter is required and must be a string : ${textOpi}`,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
		// Verify that idRec is not null and is a string
		if (!idRec) {
			context.res = {
				status: 400,
				body: `idRec parameter is required : ${idRec}`,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
		// Verify that idUser is not null and is a string
		if (!idUser) {
			context.res = {
				status: 400,
				body: `idUser parameter is required : ${idUser}`,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool
			.request()
			.input('text', sql.VarChar, textOpi)
			.input('idRec', sql.Int, idRec)
			.input('idUser', sql.Int, idUser)
			.query(
				`INSERT INTO opinions (textOpi, idRec, idUser) VAUES (@text, @idRec, @idUser)`
			);

		result.recordsets.length > 0
			? (context.res = {
					status: 409,
					body: { message: result.recordset[0] },
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
			  })
			: (context.res = {
					status: 200,
					body: { message: 'Ingredient added successfully' },
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
