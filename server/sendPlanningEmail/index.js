const { sendPlanningMail } = require('./sendPlanning');
const {
	EmailClient,
	KnownEmailSendStatus,
} = require('@azure/communication-email');
require('dotenv').config();

const handlePost = async (context, req) => {
	const { planning, mailUser } = req.body;

	if (!planning || !mailUser) {
		context.res = {
			status: 400,
			body: {
				message: 'Missing planning or mailUser parameters.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
		return;
	}

	try {
		await sendPlanningMail(planning, mailUser);
		context.res = {
			status: 200,
			body: {
				message: 'Planning sent successfully.',
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	} catch (err) {
		context.res = {
			status: 500,
			body: {
				message: `Failed to send planning: ${err}`,
			},
			headers: {
				'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			},
		};
	}
};

module.exports = function (context, req) {
	context.log('JavaScript HTTP trigger function processed a request.');

	switch (req.method) {
		case 'POST':
			handlePost(context, req);
			break;
		default:
			context.res = {
				status: 405,
				body: {
					message: 'Method not allowed.',
				},
				headers: {
					'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
				},
			};
			break;
	}
};
