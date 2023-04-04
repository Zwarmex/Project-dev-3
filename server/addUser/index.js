const sql = require('mssql');
const config = require('../config.js');

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

		const firstnameUser = req.query.firstname;
		const lastnameUser = req.query.lastname;
		const abilityUser = parseInt(req.query.ability);
		const avatarUser = req.query.avatar;
		const bioUser = req.query.bio;
		const telephoneUser = parseInt(req.query.telephone);
		const mailUser = req.query.mail;
		const passwordUser = req.query.password;
		const birthdayUser = req.query.birthday;

		// Verify that firstname is not null and is a string
		if (!firstnameUser || typeof firstnameUser !== 'string') {
			context.res = {
				status: 400,
				body: 'firstname parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that lastname is not null and is a string
		if (!lastnameUser || typeof lastnameUser !== 'string') {
			context.res = {
				status: 400,
				body: 'lastname parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that ability is a number
		if (isNaN(abilityUser)) {
			context.res = {
				status: 400,
				body: 'ability parameter must be a number',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that avatar is not null and is a string
		if (!avatarUser || typeof avatarUser !== 'string') {
			context.res = {
				status: 400,
				body: 'avatar parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that bio is not null and is a string
		if (!bioUser || typeof bioUser !== 'string') {
			context.res = {
				status: 400,
				body: 'bio parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		// Verify that telephone is a number
		if (isNaN(telephoneUser)) {
			context.res = {
				status: 400,
				body: 'telephone parameter must be a number',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

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

		// Verify that birthday is not null and is a string
		if (!birthdayUser || typeof birthdayUser !== 'string') {
			context.res = {
				status: 400,
				body: 'birthday parameter is required and must be a string',
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}

		await pool
			.request()
			.input('firstname', sql.VarChar, firstnameUser)
			.input('lastname', sql.VarChar, lastnameUser)
			.input('ability', sql.VarChar, abilityUser)
			.input('avatar', sql.VarChar, avatarUser)
			.input('bio', sql.VarChar, bioUser)
			.input('telephone', sql.VarChar, telephoneUser)
			.input('mail', sql.VarChar, mailUser)
			.input('password', sql.VarChar, passwordUser)
			.input('birthday', sql.Date, new Date(birthdayUser)).query(`
				BEGIN TRY
					INSERT INTO users (firstnameUser, lastnameUser, abilityUser, avatarUser, bioUser, telephoneUser, mailUser, passwordUser, birthdayUser)
					VALUES (@firstname, @lastname, @ability, @avatar, @bio, @telephone, @mail, @password, @birthday)
        		END TRY
				BEGIN CATCH
					IF ERROR_NUMBER() = 2627
						BEGIN
							SELECT 'Error: The user already exists' as message;
						END
					ELSE
						BEGIN
							SELECT 'Error: Failed to execute query' as message;
						END
				END CATCH
            `);

		context.res = {
			status: 200,
			body: { message: 'User added successfully' },
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
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
