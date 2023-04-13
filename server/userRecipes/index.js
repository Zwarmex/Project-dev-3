const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');

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
	const topValue = req.query.hasOwnProperty('top') ? +req.query.top : 10;
	const orderValue = req.query.hasOwnProperty('order')
		? req.query.order.toUpperCase()
		: 'IDREC';
	const sortValue = req.query.hasOwnProperty('sort')
		? req.query.sort.toUpperCase()
		: 'ASC';
	const validOrderValues = [
		'IDREC',
		'LABELREC',
		'STEPSREC',
		'NUMBEROFPERSONSREC',
		'TIMREC',
		'DIFFICULTYREC',
		'IMGREC',
		'IDCAT',
		'IDUSER',
	];
	const validSortValues = ['ASC', 'DESC'];

	if (!Number.isInteger(topValue) || topValue <= 0) {
		context.res = {
			status: 400,
			body: 'topValue must be a positive integer.',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!validOrderValues.includes(orderValue)) {
		context.res = {
			status: 400,
			body: 'orderValue must be either IDREC,LABELREC,STEPSREC,NUMBEROFPERSONSREC,TIMREC,DIFFICULTYREC,IMGREC,IDCAT,IDUSER.',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!validSortValues.includes(sortValue)) {
		context.res = {
			status: 400,
			body: "sortValue must be either 'ASC' or 'DESC', case insensitive.",
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.userRecipesGet(idUser, topValue, orderValue, sortValue);
	const result = await pool.request().query(query);

	// Verify that result is not null and contains at least one record
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `The user ${idUser} has no recipes`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	context.res = {
		status: 200,
		body: result.recordset,
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
