import TicketModel from '../models/ticketModel';

const getTicketById = async (req, res, next) => {
	const { ticketId } = req.params;

	const result = await TicketModel.findById(ticketId).exec();

	if (!result)
		return res.status(404).json({
			code: 404,
			message: 'Ticket not found',
			type: 'client.notFound',
			context: 'ticketId',
		});

	req.subject = result;
	return next();
};

const getOneTicket = (req, res) => res.status(200).json(req.subject);

const getMultipleTickets = async (req, res) => {
	const tickets = await TicketModel.find(req.query).exec();

	if (!tickets)
		return res.status(404).json({
			code: 404,
			message: 'Tickets not found',
			type: 'client.notFound',
			context: 'tickets',
		});

	return res.status(200).json(tickets);
};

const createTicket = async (req, res) => {
	const { title, priority, description } = req.body;
	const { _id } = req.user;

	const newTicket = new TicketModel({
		title,
		status: 'Open',
		priority,
		createdBy: _id,
		description,
		assignedOperator: null,
		course: [],
	});

	await newTicket.save();

	const targetTicket = await TicketModel.findById(newTicket._id)
		.populate([{ path: 'createdBy', select: ['username', 'firstName', 'lastName'] }])
		.exec();

	return res.status(201).json(targetTicket);
};

const updateTicket = async (req, res) => {
	const { _id } = req.subject;

	const targetTicket = await TicketModel.findById(_id).exec();

	targetTicket.set({
		...req.body,
		assignedOperator: req.user._id,
	});

	await targetTicket.save();

	const updatedTicket = await TicketModel.findById(_id)
		.populate([
			{ path: 'createdBy', select: ['username', 'firstName', 'lastName'] },
			{ path: 'assignedOperator', select: ['username', 'firstName', 'lastName'] },
			{
				path: 'course',
				populate: { path: 'createdBy', select: ['username', 'firstName', 'lastName'] },
			},
		])
		.exec();

	return res.status(200).json(updatedTicket);
};

const deleteTicket = async (req, res) => {
	const { _id } = req.subject;

	await TicketModel.deleteOne({ _id });

	return res.status(200).json(req.subject);
};

const addComment = async (req, res) => {
	const { _id } = req.subject;
	const { message } = req.body;

	const targetTicket = await TicketModel.findById(_id).exec();

	targetTicket.course.push({ message, createdBy: req.user._id });

	await targetTicket.save();

	const updatedTicket = await TicketModel.findById(_id)
		.populate([
			{ path: 'createdBy', select: ['username', 'firstName', 'lastName'] },
			{ path: 'assignedOperator', select: ['username', 'firstName', 'lastName'] },
			{
				path: 'course',
				populate: { path: 'createdBy', select: ['username', 'firstName', 'lastName'] },
			},
		])
		.exec();

	return res.status(200).json(updatedTicket);
};

export {
	getTicketById,
	getOneTicket,
	getMultipleTickets,
	createTicket,
	updateTicket,
	deleteTicket,
	addComment,
};
