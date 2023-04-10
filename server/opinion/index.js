const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
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
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
		const pool = await sql.connect(config);

		switch (req.method) {
			case 'POST':
				await handlePost(context, req, pool);
				break;
			case 'DELETE':
				await handleDelete(context, req, pool);
				break;
			case 'GET':
				await handleGet(context, req, pool);
				break;
			case 'PUT':
				await handlePut(context, req, pool);
				break;
			default:
				context.res = {
					status: 400,
					body: 'Invalid request method',
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
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

async function handlePost(context, req, pool) {
	const textOpi = req.body.hasOwnProperty('textOpi') ? req.body.textOpi : null;
	const idRec = req.body.hasOwnProperty('idRec') ? +req.body.idRec : null;
	const idUser = req.body.hasOwnProperty('idUser') ? +req.body.idUser : null;

	if (!textOpi) {
		context.res = {
			status: 400,
			body: { message: 'textOpi parameter is required' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idRec) {
		context.res = {
			status: 400,
			body: { message: 'idRec parameter is required' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idUser) {
		context.res = {
			status: 400,
			body: { message: 'idUser parameter is required' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!Number.isInteger(idRec) || idRec <= 0) {
		context.res = {
			status: 400,
			body: { message: 'idRec parameter must be positive integer' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!Number.isInteger(idUser) || idUser <= 0) {
		context.res = {
			status: 400,
			body: { message: 'idUser parameter must be positive integer' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.opinionPost(textOpi, idRec, idUser);
	const result = await pool.request().query(query);

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
}
async function handleDelete(context, req, pool) {
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;

	const query = queries.opnionDelete(idRec, idUser);
	const result = await pool.request().query(query);

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
}
async function handleGet(context, req, pool) {
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const topValue = req.query.hasOwnProperty('top') ? +req.query.top : 10;
	const orderValue = req.query.hasOwnProperty('order')
		? req.query.order.toUpperCase()
		: 'IDUSER';
	const sortValue = req.query.hasOwnProperty('sort')
		? req.query.sort.toUpperCase()
		: 'ASC';
	const validOrderValues = ['IDOPI', 'TEXTOPI', 'IDREC', 'IDUSER'];
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
			body: "orderValue must be either 'idCat' or 'labelCat'.",
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

	const query = queries.opinionGet(idUser, topValue, orderValue, sortValue);
	const result = await pool.request().query(query);

	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: { message: 'No opinions found for the given user' },
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
async function handlePut(context, req, pool) {
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const textOpi = req.body.hasOwnProperty('textOpi') ? req.body.textOpi : null;

	if (!textOpi) {
		context.res = {
			status: 400,
			body: 'textOpi parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.opinionPut(idRec, idUser, textOpi);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Opinion updated successfully',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Opinion not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}