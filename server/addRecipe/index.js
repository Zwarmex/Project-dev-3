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

		const nameRec = req.body.name;
		const stepsRec = req.body.steps;
		const numberOfPersonsRec = parseInt(req.body.numberOfPersons);
		const timeRec = parseInt(req.body.time);
		const difficultyRec = parseInt(req.body.difficulty);
		const imgRec = req.body.img;
		const idCat = parseInt(req.body.idCat);
		const idUser = parseInt(req.body.idUser);

		// Verify that nameRec is not null and is a string
		if (!nameRec || typeof nameRec !== 'string') {
			context.res = {
				status: 400,
				body: `name parameter is required and must be a string : ${nameRec}, ${req.body}`,
			};
			return;
		}

		await pool
			.request()
			.input('name', sql.VarChar(50), nameRec)
			.input('steps', sql.VarChar(2000), stepsRec)
			.input('numberOfPersons', sql.Int, numberOfPersonsRec)
			.input('time', sql.Int, timeRec)
			.input('difficulty', sql.Int, difficultyRec)
			.input('img', sql.VarBinary(sql.MAX), imgRec)
			.input('idCat', sql.Int, idCat)
			.input('idUser', sql.Int, idUser).query(`
		        INSERT INTO recipes (nameRec, stepsRec, numberOfPersonsRec, timeRec, difficultyRec, imgRec, idCat, idUser)
		        VALUES (@name, @steps, @numberOfPersons, @time, @difficulty, @img, @idCat, @idUser)
		    `);

		context.res = {
			status: 200,
			body: { message: 'Recipe added successfully' },
		};
	} catch (err) {
		console.log(err);
		context.res = {
			status: 500,
			body: 'Failed to execute query',
		};
	}
};
