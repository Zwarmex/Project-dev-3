const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routesHandler);

const PORT = 4000; // ? Backend routing port.
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
