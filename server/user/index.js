const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
const hashPassword = require('../hashPassword.js');
const bcrypt = require('bcryptjs');
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
			case 'PUT':
				await handlePut(context, req, pool);
				break;
			case 'DELETE':
				await handleDelete(context, req, pool);
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
	const firstnameUser = req.body.hasOwnProperty('firstname')
		? req.body.firstname
		: null;
	const lastnameUser = req.body.hasOwnProperty('lastname')
		? req.body.lastname
		: null;
	const avatarUser = req.body.hasOwnProperty('avatar') ? req.body.avatar : null;
	const bioUser = req.body.hasOwnProperty('bio') ? req.body.bio : null;
	const abilityUser = req.body.hasOwnProperty('ability')
		? +req.body.ability
		: null;
	const telephoneUser = req.body.hasOwnProperty('telephone')
		? +req.body.telephone
		: null;
	const mailUser = req.body.hasOwnProperty('mail') ? req.body.mail : null;
	const passwordUser = req.body.hasOwnProperty('password')
		? req.body.password
		: null;
	const birthdayUser = req.body.hasOwnProperty('birthday')
		? req.body.birthday
		: null;

	// Verify the parameters
	if (!firstnameUser) {
		context.res = {
			status: 400,
			body: {
				message: 'firstname parameter is required and must be a string',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!lastnameUser) {
		context.res = {
			status: 400,
			body: {
				message: 'lastname parameter is required and must be a string',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!mailUser) {
		context.res = {
			status: 400,
			body: {
				message: 'mail parameter is required and must be a string',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!passwordUser) {
		context.res = {
			status: 400,
			body: {
				message: 'password parameter is required and must be a string',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (
		!birthdayUser ||
		isNaN(Date.parse(birthdayUser.split('/').reverse().join('-')))
	) {
		context.res = {
			status: 400,
			body: {
				message:
					'birthday parameter is required, must be a string, and must be a valid date (format: DD/MM/YYYY)',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (
		telephoneUser &&
		!Number.isInteger(telephoneUser) &&
		telephoneUser.toString().length === 9
	) {
		context.res = {
			status: 400,
			body: {
				message: 'telephone must be an integer',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	const parsedBirthdayUser = new Date(
		Date.parse(birthdayUser.split('/').reverse().join('-'))
	)
		.toISOString()
		.slice(0, 10);
	const saltRounds = 10; // Recommended value for most use cases.
	const saltUser = await bcrypt.genSalt(saltRounds);
	const avatarValue = avatarUser === null ? null : `'${avatarUser}'`;
	const bioValue = bioUser === null ? 'DEFAULT' : `'${bioUser}'`;
	const abilityValue = abilityUser === null ? 'DEFAULT' : `'${abilityUser}'`;

	const hashedPasswordUser = await hashPassword(passwordUser, saltUser);

	const query = queries.userPost(
		firstnameUser,
		lastnameUser,
		abilityValue,
		avatarValue,
		bioValue,
		telephoneUser,
		mailUser,
		hashedPasswordUser,
		parsedBirthdayUser,
		saltUser
	);
	// Execute SQL query
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		context.res = {
			status: 200,
			body: {
				message: 'User added successfully',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
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
}
async function handleDelete(context, req, pool) {
	const jwtVerificationResult = verificationJWT(req);
	if (jwtVerificationResult) {
		context.res = jwtVerificationResult;
		return;
	}
	const idUser = req.body.hasOwnProperty('idUser') ? +req.body.idUser : null;

	const query = queries.userDelete(idUser);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] > 0) {
		context.res = {
			status: 200,
			body: {
				message: 'User successfully deleted',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: {
				message: 'User not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	const mailUser = req.params.mail;
	const passwordUser = req.params.password;
	const idUser = req.body.idUser;

	const queryByMail = queries.userGetPasswordAndSaltByMail(mailUser);
	const result = await pool.request().query(queryByMail);

	if (result.recordset.length > 0) {
		const storedSalt = result.recordset[0].saltUser;
		const storedHashedPassword = result.recordset[0].passwordUser;
		const hashedPassword = await hashPassword(passwordUser, storedSalt);
		if (hashedPassword === storedHashedPassword) {
			const queryUser = queries.userGet(mailUser);
			const userDetails = await pool.request().query(queryUser);

			// generate JWT
			const tokenJWT = generateJWT(idUser);

			context.res = {
				status: 200,
				body: {
					result: userDetails.recordset[0],
					tokenJWT: tokenJWT,
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
	}

	context.res = {
		status: 401,
		body: {
			message: 'Invalid email or password',
		},
		headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN },
	};
}
async function handlePut(context, req, pool) {
	const jwtVerificationResult = verificationJWT(req);
	if (jwtVerificationResult) {
		context.res = jwtVerificationResult;
		return;
	}
	const idUser = +req.params.idUser;
	const firstnameUser = req.body.hasOwnProperty('firstname')
		? req.body.firstname
		: null;
	const lastnameUser = req.body.hasOwnProperty('lastname')
		? req.body.lastname
		: null;
	const avatarUser = req.body.hasOwnProperty('avatar') ? req.body.avatar : null;
	const bioUser = req.body.hasOwnProperty('bio') ? req.body.bio : null;
	const abilityUser =
		req.body && req.body.ability ? parseInt(req.body.ability) : null;
	const telephoneUser =
		req.body && req.body.telephone ? parseInt(req.body.telephone) : null;
	const mailUser = req.body.hasOwnProperty('mail') ? req.body.mail : null;
	const passwordUser = req.body.hasOwnProperty('password')
		? req.body.password
		: null;
	const birthdayUser = req.body.hasOwnProperty('birthday')
		? req.body.birthday
		: null;

	const query = queries.userPut(
		idUser,
		firstnameUser,
		lastnameUser,
		avatarUser,
		bioUser,
		abilityUser,
		telephoneUser,
		mailUser,
		passwordUser,
		birthdayUser
	);
	const result = await pool.request().query(query);
	if (result.rowsAffected[0] > 0) {
		const tokenJWT = generateJWT(idUser);
		context.res = {
			status: 200,
			body: {
				message: 'User successfully updated',
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
				message: 'User not found',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
