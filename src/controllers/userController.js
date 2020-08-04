import UserModel from '../models/userModel';
import { genHash } from '../helpers/auth';

const signUp = async (req, res) => {
	const { username, email, password, firstName, lastName } = req.body;

	const isUserExist = await UserModel.findOne({ username }).exec();

	if (isUserExist) {
		return res.status(409).json({ error: 'Username already taken!' });
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
		if (err) return res.status(500).json({ error: 'Internal server error' });
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

const signIn = async (req, res) => {
	return res.status(200).json({ token: '' });
};

export default {
	signUp,
	signIn,
};
