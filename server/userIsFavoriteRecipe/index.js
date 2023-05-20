const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
const { verificationJWT } = require('../jwtFunctionalities.js');
require('dotenv').config();

module.exports = async function (context, req) {
	try {
		const jwtVerificationResult = verificationJWT(req);
		if (jwtVerificationResult) {
			context.res = jwtVerificationResult;
			return;
		}
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

		switch (req.method) {
			case 'GET':
				await handleGet(context, req, pool);
				break;

			default:
				context.res = {
					status: 405,
					body: 'Method not allowed',
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
				break;
		}
	} catch (err) {
		context.res = {
			status: 500,
			body: `API Failed : ${err}`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

async function handleGet(context, req, pool) {
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;

	const query = queries.userGetIsFavoriteRecipe(idUser, idRec);
	const result = await pool.request().query(query);
	context.res = {
		status: 200,
		body: result.recordset,
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
