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

	const query = queries.userGet(mailUser, passwordUser);
	// Execute SQL query
	const result = await pool.request().query(query);

	// Verify that the query was successful
	if (!result.recordset || result.recordset.length === 0) {
		context.res = {
			status: 404,
			body: 'No records found',
			headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN },
		};
		return;
	}

	context.res = {
		status: 200,
		body: 'Found',
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
async function handlePost(context, req, pool) {
	const firstnameUser = req.body && req.body.firstname;
	const lastnameUser = req.body && req.body.lastname;
	const abilityUser = parseInt(req.body && req.body.ability);
	const avatarUser = req.body && req.body.avatar;
	const bioUser = req.body && req.body.bio;
	const telephoneUser = parseInt(req.body && req.body.telephone);
	const mailUser = req.body && req.body.mail;
	const passwordUser = req.body && req.body.password;
	const birthdayUser = req.body && req.body.birthday;

	// Verify the parameters
	if (!firstnameUser || typeof firstnameUser !== 'string') {
		context.res = {
			status: 400,
			body: 'firstname parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!lastnameUser || typeof lastnameUser !== 'string') {
		context.res = {
			status: 400,
			body: 'lastname parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (isNaN(abilityUser)) {
		context.res = {
			status: 400,
			body: 'ability parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!avatarUser || typeof avatarUser !== 'string') {
		context.res = {
			status: 400,
			body: 'avatar parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!bioUser || typeof bioUser !== 'string') {
		context.res = {
			status: 400,
			body: 'bio parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (isNaN(telephoneUser)) {
		context.res = {
			status: 400,
			body: 'telphone parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!mailUser || typeof mailUser !== 'string') {
		context.res = {
			status: 400,
			body: 'mail parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!passwordUser || typeof passwordUser !== 'string') {
		context.res = {
			status: 400,
			body: 'password parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
	if (!birthdayUser || isNaN(Date.parse(birthdayUser))) {
		context.res = {
			status: 400,
			body: 'birthday parameter is required and must be a string',
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}

	const parsedBirthday = new Date(
		Date.parse(birthdayUser.split('/').reverse().join('-'))
	);
	const query = queries.userPost(
		firstnameUser,
		lastnameUser,
		abilityUser,
		avatarUser,
		bioUser,
		telephoneUser,
		mailUser,
		passwordUser,
		parsedBirthday
	);
	// Execute SQL query
	await pool.request().query(query);
	context.res = {
		status: 200,
		body: { message: 'User added successfully' },
		headers: {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
		},
	};
}
