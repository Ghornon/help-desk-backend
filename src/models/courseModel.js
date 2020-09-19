import mongoose, { Schema } from 'mongoose';

export const CourseSchema = new Schema(
	{
		message: String,
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
		},
	},
	{ timestamps: true }
);

const CourseModel = mongoose.model('Curses', CourseSchema);
export default CourseModel;
