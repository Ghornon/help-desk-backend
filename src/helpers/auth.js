import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const genHash = async (password) => {
	const salt = await bcrypt.genSalt(10);

	const hash = await bcrypt.hash(password, salt);

	return hash;
};

// Hardcoded env variable
const JWT_SECRET = 'secret-secure-hardcoded-variable';

const signToken = (userID, claims) =>
	JWT.sign(
		{
			sub: userID,
			claims,
		},
		JWT_SECRET,
		{ expiresIn: '1h' }
	);

export { genHash, signToken, JWT_SECRET };
