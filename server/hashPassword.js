const bcrypt = require('bcryptjs');
module.exports = async function hashPassword(password, salt) {
	// Hash the password using the provided salt.
	return await bcrypt.hash(password, salt);
};
