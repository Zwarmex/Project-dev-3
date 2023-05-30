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
					body: {
						message: 'Invalid request method',
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
	const labelCat = req.body.hasOwnProperty('label') ? req.body.label : null;

	// Verify that label is not null and is a string
	if (!labelCat) {
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
	// Build the SQL query string
	const query = queries.categoryPost(labelCat);
	const result = await pool.request().query(query);

	context.res = {
		status: result.recordset[0].status,
		body: {
			message: result.recordset[0].message,
		},
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
async function handleDelete(context, req, pool) {
	// The DELETE handler code goes here
	const idCat = req.params.hasOwnProperty('idCat') ? +req.params.idCat : null;

	const query = queries.categoryDelete(idCat);
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
				message: `Entry not found with this id ${idCat}`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	// The GET handler code goes here
	const idCat = req.params.hasOwnProperty('idCat') ? +req.params.idCat : null;

	const query = queries.categoryGetById(idCat);
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
	// The PUT handler code goes here
	const idCat = req.params.hasOwnProperty('idCat') ? +req.params.idCat : null;
	const labelCat = req.body.hasOwnProperty('label') ? req.body.label : null;

	if (!labelCat) {
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

	const query = queries.categoryPut(idCat, labelCat);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: {
				message: 'Category successfully updated',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: `Category not found with the specified id ${idCat}`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
