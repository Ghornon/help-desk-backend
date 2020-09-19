import Joi from '@hapi/joi';

const validateBody = (schema) => (req, res, next) => {
	const result = schema.validate(req.body);

	if (result.error) {
		const {
			message,
			type,
			context: { label },
		} = result.error.details[0];

		return res.status(400).json({
			code: 400,
			message,
			type,
			context: label,
		});
	}

	return next();
};

const schemas = {
	User: {
		username: Joi.string().min(5),
		email: Joi.string().email(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		repeatPassword: Joi.ref('password'),
		firstName: Joi.string().min(3).alphanum(),
		lastName: Joi.string().min(3).alphanum(),
		power: Joi.number().integer(),
	},
	Ticket: {
		title: Joi.string().min(5),
		priority: Joi.number().valid(1, 2, 3),
		description: Joi.string().min(5),
	},
	Curse: {
		message: Joi.string().min(5).required(),
	},
};

const bodySchemas = {
	authSchema: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
	createUserSchema: Joi.object().keys({
		...schemas.User,
		username: schemas.User.username.required(),
		email: schemas.User.email.required(),
		password: schemas.User.password.required(),
	}),
	updateUserSchema: Joi.object().keys(schemas.User),
	createTicketSchema: Joi.object().keys({
		...schemas.Ticket,
		title: schemas.Ticket.title.required(),
		priority: schemas.Ticket.priority.required(),
		description: schemas.Ticket.description.required(),
	}),
	updateTicketSchema: Joi.object().keys({
		...schemas.Ticket,
		assignedOperator: Joi.string(),
		status: Joi.string().valid('Open', 'Closed', 'In progress'),
	}),
	curseSchema: Joi.object().keys(schemas.Curse),
};

export { validateBody, bodySchemas };
