import UserModel from '../models/userModel';
import { genHash, signToken } from '../helpers/auth';

const signIn = async (req, res) => {
	const { _id } = req.user;
	const token = signToken(_id);

	return res.status(200).json({ token });
};

const signUp = async (req, res) => {
	const { username, email, password, firstName, lastName } = req.body;

	const isUserExist = await UserModel.findOne({ username }).exec();

	if (isUserExist) {
		return res.status(409).json({
			code: 409,
			message: '"Username" already taken!',
			type: 'client.conflict',
			context: 'username',
		});
	}

	const hash = await genHash(password);

	const newUser = new UserModel({
		username,
		email,
		password: hash,
		firstName,
		lastName,
		power: 1,
	});

	await newUser.save((err, doc) => {
		if (err)
			return res.status(500).json({
				code: 500,
				message: 'Internal Server Error',
				type: 'server.internal',
				context: 'server',
			});
		return doc;
	});

	const token = signToken(newUser.id);

	return res.status(201).json({ token });
};

export default {
	signIn,
	signUp,
};
