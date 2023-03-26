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
			};
			return;
		}

		const pool = await sql.connect(config);
		const firstnameUser = req.query.firstname;
		const lastnameUser = req.query.lastname;
		const abilityUser = req.query.ability;
		const avatarUser = req.query.avatar;
		const bioUser = req.query.bio;
		const telephoneUser = req.query.telephone;
		const mailUser = req.query.mail;
		const passwordUser = req.query.password;
		const birthdayUser = req.query.birthday;

		// Verify that firstname is not null and is a string
		if (!firstnameUser || typeof firstnameUser !== 'string') {
			context.res = {
				status: 400,
				body: 'label parameter is required and must be a string',
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
                INSERT INTO users (firstnameUser, lastnameUser, abilityUser, avatarUser, bioUser, telephoneUser, mailUser, passwordUser, birthdayUser) 
                VALUES (@firstname, @lastname, @ability, @avatar, @bio, @telephone, @mail, @password, @birthday)
            `);

		context.res = {
			status: 200,
			body: { message: 'User added successfully' },
		};
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
