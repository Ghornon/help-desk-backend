import router from 'express-promise-router';

import { validateBody, bodySchemas } from '../helpers/validator';
import { userController } from '../controllers';
import passport from '../helpers/passport';
import accessGuard from '../helpers/accessGuard';

const { createUserSchema, updateUserSchema } = bodySchemas;

const {
	getUserById,
	getOneUser,
	getMultipleUsers,
	createUser,
	updateUser,
	deleteUser,
} = userController;

const usersRouter = router();
usersRouter.use(passport.authenticate('jwt', { session: false }));
usersRouter.param('userId', getUserById);

usersRouter
	.route('/users')
	.get(accessGuard('mod'), getMultipleUsers)
	.post(accessGuard('mod'), validateBody(createUserSchema), createUser);
usersRouter
	.route('/users/:userId')
	.get(accessGuard('owner'), getOneUser)
	.put(accessGuard('owner'), validateBody(updateUserSchema), updateUser)
	.delete(accessGuard('admin'), deleteUser);

// Export
export default usersRouter;
