const bcrypt = require('bcrypt');
module.exports = async function hashPassword(password, salt) {
	// Hash the password using the provided salt.
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};
