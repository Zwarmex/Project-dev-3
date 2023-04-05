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
	const idUser = parseInt(req.params.idUser);
	const idFriend = parseInt(req.boy && req.body.idFriend);

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
			body: `idFriend parameter is required`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	if (!idUser) {
		context.res = {
			status: 400,
			body: `idUser parameter is required`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.friendPost(idUser, idFriend);
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
				body: { message: 'Friend added successfully' },
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  });
}
async function handleDelete(context, req, pool) {
	// The DELETE handler code goes here
	const idUser = parseInt(req.params.idUser);
	const idFriend = parseInt(req.params.idFriend);

	// Verify that idUser and idFriend are not null
	if (!idUser || !idFriend) {
		context.res = {
			status: 400,
			body: 'Both idUser and idFriend parameters are required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.friendDelete(idUser, idFriend);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Friend successfully deleted',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Friend not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	const idUser = parseInt(req.params.idUser);
	const topValue = req.query.top || 10;
	const orderValue = req.query.order || 'idUser';
	const sortValue = req.query.sort || 'ASC';

	// Verify that idUser is not null
	if (!idUser) {
		context.res = {
			status: 400,
			body: 'idUser parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.friendGet(idUser, topValue, orderValue, sortValue);
	const result = await pool.request().query(query);

	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No friends found`,
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
	const idUser = parseInt(req.params.idUser);
	const idFriend = parseInt(req.body && req.body.idFriend);
	const newIdFriend = parseInt(req.body && req.body.newIdFriend);

	// Verify that idUser, idFriend, and newIdFriend are not null
	if (!idUser || !idFriend || !newIdFriend) {
		context.res = {
			status: 400,
			body: 'idUser, idFriend, and newIdFriend parameters are required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.friendPut(idUser, idFriend, newIdFriend);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Friend successfully updated',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Friend not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
