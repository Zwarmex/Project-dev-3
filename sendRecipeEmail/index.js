const {
	EmailClient,
	KnownEmailSendStatus,
} = require('@azure/communication-email');
require('dotenv').config();
const { verificationJWT, generateJWT } = require('../jwtFunctionalities.js');

module.exports = async function (context, req) {
	try {
		const jwtVerificationResult = verificationJWT(req);
		if (jwtVerificationResult) {
			context.res = jwtVerificationResult;
			return;
		}
		switch (req.method) {
			case 'POST':
				await handlePost(context, req);
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

async function handlePost(context, req) {
	const { recipe } = req.body.hasOwnProperty('recipe')
		? JSON.parse(req.body.recipe)
		: null;
	const date = req.body.hasOwnProperty('date') ? req.body.date : null;
	const mailUser = req.params.mailUser;
	const idUser = req.body.hasOwnProperty('idUser') ? req.body.idUser : null;
	const emailClient = new EmailClient(
		process.env.COMMUNICATION_SERVICES_CONNECTION_STRING
	);
	const senderAddress = process.env.SENDER_ADDRESS;
	const POLLER_WAIT_TIME = 10;

	const htmlContent = `<h1>
							Recette du ${new Date(date).toLocaleDateString('fr-FR')} : ${recipe.labelRec}
						</h1>
						<img
							loading='lazy'
							src="${recipe.imgRec}"
							alt="Image de la recette ${recipe.labelRec}"
						/>
						<p>
							Étapes : ${JSON.parse(recipe.stepsRec).blocks[0].text}
						</p>
						`;

	const message = {
		senderAddress: senderAddress,
		content: {
			subject: `Recette du ${new Date(date).toLocaleDateString('fr-FR')} : ${
				recipe.labelRec
			}`,
			html: htmlContent,
		},
		recipients: {
			to: [
				{
					address: `${mailUser}`,
				},
			],
		},
	};

	const poller = await emailClient.beginSend(message);

	if (!poller.getOperationState().isStarted) {
		context.res = {
			status: 500,
			body: {
				message: 'The email was not sent.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	let timeElapsed = 0;
	while (!poller.isDone()) {
		poller.poll();

		await new Promise((resolve) =>
			setTimeout(resolve, POLLER_WAIT_TIME * 1000)
		);
		timeElapsed += 10;

		if (timeElapsed > 18 * POLLER_WAIT_TIME) {
			context.res = {
				status: 500,
				body: {
					message: 'Polling timed out.',
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			return;
		}
	}

	if (poller.getResult().status === KnownEmailSendStatus.Succeeded) {
		const tokenJWT = generateJWT(idUser);

		context.res = {
			status: 200,
			body: {
				message: 'Email sent successfully.',
				token: tokenJWT,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} else {
		context.res = {
			status: 500,
			body: {
				message: poller.getResult().error,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}
}
