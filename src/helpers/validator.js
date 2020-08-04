import Joi from '@hapi/joi';

const validateBody = (schema) => (req, res, next) => {
	const result = schema.validate(req.body);

	if (result.error) {
		return res.status(400).json({ error: result.error.details });
	}

	return next();
};

const schemas = {
	authSchema: Joi.object().keys({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
	signUpSchema: Joi.object().keys({
		username: Joi.string().min(5).required(),
		email: Joi.string().email().required(),
		password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
		repeatPassword: Joi.ref('password'),
		firstName: Joi.string().min(3).alphanum(),
		lastName: Joi.string().min(3).alphanum(),
	}),
};

export { validateBody, schemas };
