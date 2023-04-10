const sql = require('mssql');
const config = require('../config.js');
const queries = require('../queries.js');
const hashPassword = require('../hashPassword.js');
const bcrypt = require('bcryptjs');

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
		case 'PUT':
			await handlePut(context, req, pool);
			break;
		case 'DELETE':
			await handleDelete(context, req, pool);
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
			body: 'firstname parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!lastnameUser) {
		context.res = {
			status: 400,
			body: 'lastname parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!mailUser) {
		context.res = {
			status: 400,
			body: 'mail parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
	if (!passwordUser) {
		context.res = {
			status: 400,
			body: 'password parameter is required and must be a string',
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
			body: 'birthday parameter is required, must be a string, and must be a valid date (format: DD/MM/YYYY)',
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
			body: 'telephone must be an integer',
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
			body: { message: 'User added successfully' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: result.recordset[0].status,
			body: { message: result.recordset[0].message },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleDelete(context, req, pool) {
	const idUser = req.body.hasOwnProperty('idUser') ? +req.body.idUser : null;

	if (!idUser || !Number.isInteger(idUser)) {
		context.res = {
			status: 400,
			body: 'idUser parameter is required and must be a number',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const query = queries.userDelete(idUser);
	const result = await pool.request().query(query);

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'User successfully deleted',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'User not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
async function handleGet(context, req, pool) {
	const mailUser = req.params.mail;
	const passwordUser = req.params.password;

	// Verify that mail is not null and is a string
	if (!mailUser || typeof mailUser !== 'string') {
		context.res = {
			status: 400,
			body: 'mail parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	// Verify that password is not null and is a string
	if (!passwordUser || typeof passwordUser !== 'string') {
		context.res = {
			status: 400,
			body: 'password parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	const queryByMail = queries.userGetPasswordAndSaltByMail(mailUser);
	// Execute SQL query
	const result = await pool.request().query(queryByMail);

	if (result.recordset.length > 0) {
		const storedSalt = result.recordset[0].saltUser;
		const storedHashedPassword = result.recordset[0].passwordUser;

		// Hash the provided password with the retrieved salt.
		const hashedPassword = await hashPassword(passwordUser, storedSalt);
		// Compare the computed hash with the stored hashed password.
		if (hashedPassword === storedHashedPassword) {
			// Password is correct, return user details (excluding the password and salt).
			const queryUser = queries.userGet(mailUser);
			const userDetails = await pool.request().query(queryUser);
			context.res = {
				status: 200,
				body: userDetails.recordset[0],
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
	}

	// If the email is not found or the password is incorrect, return an appropriate error message.
	context.res = {
		status: 401,
		body: 'Invalid email or password',
		headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN },
	};
}
async function handlePut(context, req, pool) {
	const idUser = req.params.idUser;
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

	// Add validations for each field here

	// Update the user information in the database using the provided idUser and other fields
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

	if (result.rowsAffected[0] === 1) {
		context.res = {
			status: 200,
			body: 'User successfully updated',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 404,
			body: 'User not found',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
}
