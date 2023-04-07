const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');

module.exports = async function (context, req) {
	context.log('Processing a request for recipe API.');

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
		case 'POST':
			await handlePost(context, req, pool);
			break;
		case 'DELETE':
			await handleDelete(context, req, pool);
			break;
		case 'PUT':
			await handlePut(context, req, pool);
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
};

async function handlePost(context, req, pool) {
	const labelRec = req.body && req.body.label;
	const stepsRec = req.body && req.body.steps;
	const numberOfPersonsRec = parseInt(req.body && req.body.numberOfPersons);
	const timeRec = parseInt(req.body && req.body.time);
	const difficultyRec = parseInt(req.body && req.body.difficulty);
	const imgRec = req.body && req.body.img;
	const idCat = parseInt(req.body && req.body.idCat);
	const idUser = parseInt(req.body && req.body.idUser);

	// Verify that nameRec is not null and is a string
	if (!nameRec || typeof nameRec !== 'string') {
		context.res = {
			status: 400,
			body: `name parameter is required and must be a string : ${nameRec}, ${req.body}`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.recipePost(
		labelRec,
		stepsRec,
		numberOfPersonsRec,
		timeRec,
		difficultyRec,
		imgRec,
		idCat,
		idUser
	);
	const result = await pool.request().query(query);

	result.recordsets.length > 0
		? (context.res = {
				status: 409,
				body: { message: result.recordset[0] },
		  })
		: (context.res = {
				status: 200,
				body: { message: 'Recipe added successfully' },
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
		  });
}
async function handleDelete(context, req, pool) {
	const idRec = req.params.idRec;
	const idUser = req.params.idUser;

	// Verify that idIng is a valid integer
	if (isNaN(idRec)) {
		context.res = {
			status: 400,
			body: `id parameter is required and must be a valid integer`,
		};
		return;
	}

	// Verify that idUser is a valid integer
	if (isNaN(idUser)) {
		context.res = {
			status: 400,
			body: `idUser parameter is required and must be a valid integer`,
		};
		return;
	}
	const query = queries.recipeDelete(idRec, idUser);
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
	const idRec = req.params.idRec;

	// Verify that idIng is not null
	if (!idRec) {
		context.res = {
			status: 400,
			body: 'id parameter is required',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Verify that idIng is a number
	if (isNaN(idRec)) {
		context.res = {
			status: 400,
			body: 'id parameter must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.recipeGetById(idRec);
	const result = await pool.request().query(query);

	// Verify that result is not null and contains at least one record
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: `No recipes found with the specified id ${idRec}`,
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
	const labelRec = req.body && req.body.label;
	const stepsRec = req.body && req.body.steps;
	const numberOfPersonsRec = parseInt(req.body && req.body.numberOfPersons);
	const timeRec = parseInt(req.body && req.body.time);
	const difficultyRec = parseInt(req.body && req.body.difficulty);
	const imgRec = req.body && req.body.img;
	const idCat = parseInt(req.body && req.body.idCat);

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

	const query = queries.recipePut(
		idRec,
		idUser,
		labelRec,
		stepsRec,
		numberOfPersonsRec,
		timeRec,
		difficultyRec,
		imgRec,
		idCat
	);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'Recipe updated successfully',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'Recipe not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
