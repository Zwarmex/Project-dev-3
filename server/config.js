require('dotenv').config();
const config = {
	user: process.env.USER,
	password: process.env.PASSWORD,
	server: process.env.SERVER,
	database: process.env.DATABASE,
	// port: parseInt(process.env.PORT_SERVER, 10),
	trustServerCertificate: true,
};
module.exports = config;
