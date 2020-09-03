import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const genHash = async (password) => {
	const salt = await bcrypt.genSalt(10);

	const hash = await bcrypt.hash(password, salt);

	return hash;
};

// Hardcoded env variable
const JWT_SECRET = '!YmZd!uj@6w7b4=cG5dC';

const signToken = (userId, power) =>
	JWT.sign(
		{
			sub: userId,
			power,
		},
		JWT_SECRET,
		{ expiresIn: '1h' }
	);

export { genHash, signToken, JWT_SECRET };
