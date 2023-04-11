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
	const labelRec = req.body.hasOwnProperty('label') ? req.body.label : null;
	const stepsRec = req.body.hasOwnProperty('steps') ? req.body.steps : null;
	const numberOfPersonsRec = req.body.hasOwnProperty('numberOfPersons')
		? +req.body.numberOfPersons
		: null;
	const timeRec = req.body.hasOwnProperty('time') ? +req.body.time : null;
	const difficultyRec = req.body.hasOwnProperty('difficulty')
		? +req.body.difficulty
		: null;
	const imgRec = req.body.hasOwnProperty('img')
		? req.body.img !== null
			? `'${req.body.img}'`
			: null
		: null;
	const idCat = req.body.hasOwnProperty('idCat') ? +req.body.idCat : null;
	const idUser = req.body.hasOwnProperty('idUser') ? +req.body.idUser : null;

	if (!labelRec) {
		context.res = {
			status: 400,
			body: `label parameter is required`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!stepsRec) {
		context.res = {
			status: 400,
			body: `steps parameter is required`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (
		!numberOfPersonsRec ||
		numberOfPersonsRec < 0 ||
		!Number.isInteger(numberOfPersonsRec)
	) {
		context.res = {
			status: 400,
			body: `numberOfPersons parameter must be a positive integer`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!timeRec || !Number.isInteger(timeRec) || timeRec < 0) {
		context.res = {
			status: 400,
			body: `time parameter must be a positive integer`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (
		!Number.isInteger(difficultyRec) ||
		!(difficultyRec >= 1 && difficultyRec <= 5)
	) {
		context.res = {
			status: 400,
			body: `difficulty parameter must be a positive integer between 1 and 5`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idCat || !Number.isInteger(idCat) || idCat < 0) {
		context.res = {
			status: 400,
			body: `idCat parameter must be a positive integer`,
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idUser || !Number.isInteger(idUser) || idUser < 0) {
		context.res = {
			status: 400,
			body: `idUser parameter must be a positive integer`,
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
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;

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
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;

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
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const labelRec = req.body.hasOwnProperty('label') ? req.body.label : null;
	const stepsRec = req.body.hasOwnProperty('steps') ? req.body.steps : null;
	const numberOfPersonsRec = req.body.hasOwnProperty('numberOfPersons')
		? +req.body.numberOfPersons
		: null;
	const timeRec = req.body.hasOwnProperty('time') ? +req.body.time : null;
	const difficultyRec = req.body.hasOwnProperty('difficulty')
		? +req.body.difficulty
		: null;
	const imgRec = req.body.hasOwnProperty('img') ? req.body.img : null;
	const idCat = req.body.hasOwnProperty('idCat') ? +req.body.idCat : null;

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
