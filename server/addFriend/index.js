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

		const idFriend = parseInt(req.body.idRec);
		const idUser = parseInt(req.body.idUser);

		if (idUser === idFriend) {
			context.res = {
				status: 400,
				body: `Friend id not acceptable`,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
		}

		if (!idFriend) {
			context.res = {
				status: 400,
				body: `idRec parameter is required : ${idFriend}`,
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

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
			.input('idRec', sql.Int, idFriend)
			.input('idUser', sql.Int, idUser)
			.query(
				`INSERT INTO friends (idUser, idFriend) VAUES (@idUser, @idFriend)`
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
					body: { message: 'Friend added successfully' },
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
