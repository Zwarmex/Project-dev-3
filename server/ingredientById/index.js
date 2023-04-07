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
	// The POST handler code goes here
	const labelIng = req.body && req.body.label;

	// Verify that labelIng is not null and is a string
	if (!labelIng || typeof labelIng !== 'string') {
		context.res = {
			status: 400,
			body: `label parameter is required and must be a string`,
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
	const idIng = req.params.idIng;

	if (!idIng) {
		context.res = {
			status: 400,
			body: 'id parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (isNaN(idIng)) {
		context.res = {
			status: 400,
			body: 'id parameter must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.ingredientDelete(idIng);
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
	const idIng = req.params.idIng;

	if (!idIng || isNaN(idIng)) {
		context.res = {
			status: 400,
			body: 'id parameter must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.ingredientGetById(idIng);
	const result = await pool.request().query(query);

	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No ingredient found with the specified id ${idIng}`,
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
	const idIng = req.params.idIng;
	const labelIng = req.body && req.body.label;

	if (!idIng || isNaN(idIng)) {
		context.res = {
			status: 400,
			body: 'id parameter must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (!labelIng || typeof labelIng !== 'string') {
		context.res = {
			status: 400,
			body: 'label parameter is required and must be a string',
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
			body: 'Entry successfully updated',
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
