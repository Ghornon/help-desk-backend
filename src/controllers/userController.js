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
			error: [
				{
					message: 'Username already taken!',
					path: 'username',
					type: 'string',
					context: {
						value: username,
						label: 'username',
						key: 'username',
					},
				},
			],
		});
	}

	const hash = await genHash(password);

	const newUser = new UserModel({
		username,
		email,
		password: hash,
		firstName,
		lastName,
	});

	await newUser.save((err, doc) => {
		if (err)
			return res.status(500).json({
				error: [
					{
						message: 'Internal server error',
					},
				],
			});
		return doc;
	});

	return res.status(201).json({
		_id: newUser.id,
		username,
		email,
		firstName,
		lastName,
	});
};

export default {
	signIn,
	signUp,
};
