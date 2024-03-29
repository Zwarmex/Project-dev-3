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
				body: {
					message: 'Database configuration is missing or incomplete',
				},
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
			case 'GET':
				await handleGet(context, req, pool);
				break;
			case 'DELETE':
				await handleDelete(context, req, pool);
				break;
			case 'PUT':
				await handlePut(context, req, pool);
				break;
			default:
				context.res = {
					status: 400,
					body: {
						message: 'Invalid request method',
					},
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
		}
	} catch (err) {
		context.res = {
			status: 500,
			body: {
				message: `API Failed : ${err}`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

async function handlePost(context, req, pool) {
	// The POST handler code goes here
	const labelIng = req.body.hasOwnProperty('label') ? req.body.label : null;

	// Verify that labelIng is not null
	if (!labelIng) {
		context.res = {
			status: 400,
			body: {
				message: `label parameter is required`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.ingredientPost(labelIng);
	const result = await pool.request().query(query);

	result.recordsets.length > 0
		? (context.res = {
				status: 409,
				body: {
					message: result.recordset[0],
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  })
		: (context.res = {
				status: 200,
				body: {
					message: 'Ingredient added successfully',
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  });
}
async function handleDelete(context, req, pool) {
	const idIng = req.params.hasOwnProperty('idIng') ? +req.params.idIng : null;

	const query = queries.ingredientDelete(idIng);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		context.res = {
			status: 200,
			body: {
				message: 'Entry successfully deleted',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: 'Entry not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	const idIng = req.params.hasOwnProperty('idIng') ? +req.params.idIng : null;

	const query = queries.ingredientGetById(idIng);
	const result = await pool.request().query(query);

	context.res = {
		status: 200,
		body: {
			result: result.recordset,
		},
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
async function handlePut(context, req, pool) {
	const idIng = req.params.hasOwnProperty('idIng') ? +req.params.idIng : null;
	const labelIng = req.body.hasOwnProperty('label') ? req.body.label : null;

	if (!labelIng) {
		context.res = {
			status: 400,
			body: {
				message: 'label parameter is required',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.ingredientPut(idIng, labelIng);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: {
				message: 'Entry successfully updated',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: 'Entry not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
