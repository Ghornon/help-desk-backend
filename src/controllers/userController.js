import UserModel from '../models/userModel';
import { genHash } from '../helpers/auth';

const getUserById = async (req, res, next) => {
	const { userId } = req.params;

	const user = await UserModel.findById(userId).exec();

	if (!user)
		return res.status(404).json({
			code: 404,
			message: 'User not found',
			type: 'client.notFound',
			context: 'userId',
		});

	req.subject = user;
	return next();
};

const getOneUser = (req, res) => {
	return res.status(200).json(req.subject);
};

const getMultipleUsers = async (req, res) => {
	const users = await UserModel.find(req.query).exec();

	if (!users)
		return res.status(404).json({
			code: 404,
			message: 'Users not found',
			type: 'client.notFound',
			context: 'users',
		});

	return res.status(200).json(users);
};

const createUser = async (req, res) => {
	const { username, email, password, firstName, lastName, power = 1 } = req.body;

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
		power,
	});

	await newUser.save();

	return res.status(201).json({
		_id: newUser.id,
		username,
		email,
		firstName,
		lastName,
		power,
	});
};

const updateUser = async (req, res) => {
	const { _id } = req.subject;
	const { username, password } = req.body;

	if (username) {
		const isUserExist = await UserModel.findOne({ username }).populate('password').exec();

		if (isUserExist) {
			return res.status(409).json({
				code: 409,
				message: '"Username" already taken!',
				type: 'client.conflict',
				context: 'username',
			});
		}
	}

	const user = await UserModel.findById(_id).exec();

	user.set(req.body);

	if (password) {
		const hash = await genHash(password);
		user.set('password', hash);
	}

	await user.save();

	const updatedUser = await UserModel.findById(_id).exec();

	return res.status(200).json(updatedUser);
};

const deleteUser = async (req, res) => {
	const { _id } = req.subject;

	await UserModel.deleteOne({ _id });

	return res.status(200).json(req.subject);
};

export default {
	getUserById,
	getOneUser,
	getMultipleUsers,
	createUser,
	updateUser,
	deleteUser,
};
