import bcrypt from 'bcryptjs';

const genHash = async (password) => {
	const salt = await bcrypt.genSalt(10);

	const hash = await bcrypt.hash(password, salt);

	return hash;
};

export { genHash }; // eslint-disable-line
