const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
require('dotenv').config();
const { verificationJWT, generateJWT } = require('../jwtFunctionalities.js');

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
					body: {
						message: 'Method not allowed',
					},
					headers: {
						'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
					},
				};
				break;
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
	const jwtVerificationResult = verificationJWT(req);
	if (jwtVerificationResult) {
		context.res = jwtVerificationResult;
		return;
	}
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
	const ingredients = req.body.hasOwnProperty('ingredients')
		? req.body.ingredients
		: null;
	if (!labelRec) {
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
	if (!stepsRec) {
		context.res = {
			status: 400,
			body: {
				message: `steps parameter is required`,
			},
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
			body: {
				message: `numberOfPersons parameter must be a positive integer`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!timeRec || !Number.isInteger(timeRec) || timeRec < 0) {
		context.res = {
			status: 400,
			body: {
				message: `time parameter must be a positive integer`,
			},
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
			body: {
				message: `difficulty parameter must be a positive integer between 1 and 5`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idCat || !Number.isInteger(idCat) || idCat < 0) {
		context.res = {
			status: 400,
			body: {
				message: `idCat parameter must be a positive integer`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!idUser || !Number.isInteger(idUser) || idUser < 0) {
		context.res = {
			status: 400,
			body: {
				message: `idUser parameter must be a positive integer`,
			},
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
	const resultRecipe = await pool.request().query(query);
	const idRec = resultRecipe.recordset[0][''];
	if (ingredients && ingredients.length > 0) {
		for (let index = 0; index < ingredients.length; index++) {
			const ingredient = ingredients[index];
			let idIng;
			if (ingredient.idIng === null) {
				const queryIngredientPost = queries.ingredientPost(ingredient.labelIng);
				const resultIngredient = await pool
					.request()
					.query(queryIngredientPost);
				idIng = +resultIngredient.recordset[0][''];
			} else {
				idIng = +ingredient.idIng;
			}
			const queryRecipeIngredientPost = queries.recipeIngredientsPost(
				idIng,
				idRec,
				ingredient.quantityRecIng,
				ingredient.unitRecIng
			);
			await pool.request().query(queryRecipeIngredientPost);
		}
	}

	if (resultRecipe.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'Recipe added successfully',
				tokenJWT: tokenJWT,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 409,
			body: {
				message: 'Error in the insert statement',
			},
		};
	}
}
async function handleDelete(context, req, pool) {
	const jwtVerificationResult = verificationJWT(req);
	if (jwtVerificationResult) {
		context.res = jwtVerificationResult;
		return;
	}
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;
	const idUser = req.params.hasOwnProperty('idUser')
		? +req.params.idUser
		: null;
	const abilityUser = req.body.hasOwnProperty('abilityUser')
		? +req.body.abilityUser
		: null;

	if (
		abilityUser !== null &&
		(!Number.isInteger(abilityUser) || abilityUser <= 0)
	) {
		context.res = {
			status: 400,
			body: {
				message: 'abilityUser must be a positive integer.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const query = queries.recipeDelete(idRec, idUser, abilityUser);
	console.log(query);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'Entry successfully deleted',
				tokenJWT: tokenJWT,
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
	const idRec = req.params.hasOwnProperty('idRec') ? +req.params.idRec : null;

	const queryRecipe = queries.recipeGetById(idRec);
	const rawRecipe = await pool.request().query(queryRecipe);
	const recipe = rawRecipe.recordset[0];
	const queryIngredients = queries.recipeIngredientsGet(idRec);
	const rawIngredients = await pool.request().query(queryIngredients);
	const ingredients = rawIngredients.recordset;
	for (let index = 0; index < ingredients.length; index++) {
		const queryIngredient = queries.ingredientGetById(ingredients[index].idIng);
		const rawIngredient = await pool.request().query(queryIngredient);
		const ingredient = rawIngredient.recordset[0];
		ingredients[index].labelIng = ingredient.labelIng;
	}
	recipe.ingredients = ingredients;
	context.res = {
		status: 200,
		body: {
			result: recipe,
		},
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
async function handlePut(context, req, pool) {
	const jwtVerificationResult = verificationJWT(req);
	if (jwtVerificationResult) {
		context.res = jwtVerificationResult;
		return;
	}
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

	if (result.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'Recipe updated successfully',
				tokenJWT: tokenJWT,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: 'Recipe not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
