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

async function handlePost(context, req, pool) {
	const textOpi = req.body && req.body.name;
	const idRec = parseInt(req.body && req.body.idRec);
	const idUser = parseInt(req.body && req.body.idUser);

	if (!textOpi || typeof textOpi !== 'string') {
		context.res = {
			status: 400,
			body: { message: 'Invalid textOpi parameter' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (isNaN(idRec)) {
		context.res = {
			status: 400,
			body: { message: 'Invalid idRec parameter' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (isNaN(idUser)) {
		context.res = {
			status: 400,
			body: { message: 'Invalid idUser parameter' },
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
	const idRec = parseInt(req.params.idRec);
	const idUser = parseInt(req.params.idUser);

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
	const idUser = parseInt(req.params.idUser);
	const topValue = req.query.top || 10;
	const orderValue = req.query.order || 'idOpi';
	const sortValue = req.query.sort || 'ASC';

	if (isNaN(idUser) || idUser <= 0) {
		context.res = {
			status: 400,
			body: { message: 'Invalid idUser parameter' },
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
	const idRec = parseInt(req.params.idRec);
	const idUser = parseInt(req.params.idUser);
	const textOpi = req.body && req.body.textOpi;

	if (isNaN(idRec) || isNaN(idUser)) {
		context.res = {
			status: 400,
			body: 'Both idRec and idUser parameters are required and must be numbers',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (!textOpi || typeof textOpi !== 'string') {
		context.res = {
			status: 400,
			body: 'textOpi parameter is required and must be a string',
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
