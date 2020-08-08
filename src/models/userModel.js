import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
	{
		username: String,
		password: {
			type: String,
			select: false,
		},
		email: String,
		firstName: String,
		lastName: String,
		groups: [{ name: String, power: Number }],
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('Users', userSchema);
export default UserModel;
