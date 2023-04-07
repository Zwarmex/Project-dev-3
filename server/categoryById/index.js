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
	const labelCat = req.body && req.body.label;

	// Verify that label is not null and is a string
	if (!labelCat || typeof labelCat !== 'string') {
		context.res = {
			status: 400,
			body: 'label parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	// Build the SQL query string
	const query = queries.categoryPost(labelCat);

	const result = await pool.request().query(query);

	result.recordsets.length > 0
		? (context.res = {
				status: 409,
				body: { message: result.recordset[0] },
		  })
		: (context.res = {
				status: 200,
				body: { message: 'Category added successfully' },
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  });
}
async function handleDelete(context, req, pool) {
	// The DELETE handler code goes here
	const idCat = parseInt(req.params.idCat);

	// Verify that idCat is not null
	if (!idCat) {
		context.res = {
			status: 400,
			body: 'idCat parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Verify that idCat is a string
	if (isNaN(idCat)) {
		context.res = {
			status: 400,
			body: 'idCat parameter must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.categoryDelete(idCat);
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
	// The GET handler code goes here
	const idCat = req.params.idCat;

	// Verify that idCat is not null
	if (!idCat) {
		context.res = {
			status: 400,
			body: 'id parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Verify that idCat is a number
	if (isNaN(idCat)) {
		context.res = {
			status: 400,
			body: 'id parameter must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.categoryGetById(idCat);
	const result = await pool.request().query(query);

	// Verify that result is not null
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No category found with the specified id ${idCat}`,
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
	// The PUT handler code goes here
	const idCat = parseInt(req.params.idCat);
	const labelCat = req.body && req.body.label;

	// Verify that idCat and labelCat are not null
	if (!idCat || !labelCat) {
		context.res = {
			status: 400,
			body: 'Both idCat and label parameters are required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Verify that idCat is a number and labelCat is a string
	if (isNaN(idCat) || typeof labelCat !== 'string') {
		context.res = {
			status: 400,
			body: 'idCat parameter must be a number and label parameter must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.categoryPut(idCat, labelCat);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Category successfully updated',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Category not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
