import mongoose, { Schema } from 'mongoose';

export const UserSchema = new Schema(
	{
		username: String,
		password: {
			type: String,
			select: false,
		},
		email: String,
		firstName: String,
		lastName: String,
		power: Number,
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;
