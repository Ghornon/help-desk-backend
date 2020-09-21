const roles = {
	user: 1,
	owner: 3,
	mod: 5,
	admin: 7,
};

const accessGuard = (hasRole) => (req, res, next) => {
	const { _id, power } = req.user; // Authenticated user

	if (hasRole === 'owner') {
		const { userId } = req.params || {}; // When request is for /api/users/:userId
		const { createdBy } = req.subject || {}; // When request is for /api/{collection}/:{collectionId}

		const condition = userId || createdBy || req.query.createdBy || {};

		if (condition.toString() === _id.toString()) return next();
	}

	if (power >= roles[hasRole]) {
		return next();
	}

	return res.status(403).json({});
};

export default accessGuard;
