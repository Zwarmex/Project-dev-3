const sgMail = require('@sendgrid/mail');
require('dotenv').config;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function (context, req) {
	try {
		switch (req.method) {
			case 'POST':
				await handlePost(context, req);
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

async function handlePost(context, req) {
	const { recipe } = req.body.hasOwnProperty('recipe')
		? JSON.parse(req.body.recipe)
		: null;
	const date = req.body.hasOwnProperty('date') ? req.body.date : null;
	const userEmail = req.params.mailUser;

	const recipeMail = {
		to: userEmail,
		from: process.env.SENDGRID_FROM_EMAIL,
		subject: `Recette : ${recipe.labelRec}`,
		html: `
        <h1>Recette : ${recipe.labelRec}</h1>
        <h2>Date: ${date}</h2>
        <img src="${recipe.imgRec}" alt="Recette image" width="300" />
        <h3>Details:</h3>
        <span>
            Étapes : ${JSON.parse(recipe.stepsRec).blocks[0].text}
        </span>`,
	};

	try {
		// Send email
		const response = await sgMail.send(recipeMail);

		if (response[0]?.statusCode >= 200 && response[0]?.statusCode < 300) {
			context.res = {
				status: 200,
				body: 'Email sent successfully',
			};
		} else {
			context.res = {
				status: 500,
				body: `Failed to send email: ${JSON.stringify(response)}`,
			};
		}
	} catch (error) {
		context.res = {
			status: 500,
			body: `Failed to send email: ${error}`,
		};
	}
}
