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

		const idRec = parseInt(req.query.name);
		const idUser = parseInt(req.body.idUser);

		if (!idRec) {
			context.res = {
				status: 400,
				body: 'idRec parameter missing',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		if (!idUser) {
			context.res = {
				status: 400,
				body: 'idUser parameter missing',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		const result = await pool
			.request()
			.input('idRec', sql.Int, idRec)
			.query(
				'DELETE TOP(1) FROM opinions WHERE idRed=@idRec AND idUser=@idUser'
			);

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
