import mongoose, { Schema } from 'mongoose';
import { CourseSchema } from './courseModel';

export const TicketSchema = new Schema(
	{
		title: String,
		status: String,
		priority: Number,
		assignedOperator: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Users',
		},
		course: [CourseSchema],
	},
	{ timestamps: true }
);

const TicketsModel = mongoose.model('Tickets', TicketSchema);
export default TicketsModel;
