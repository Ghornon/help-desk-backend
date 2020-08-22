import router from 'express-promise-router';

import { validateBody, schemas } from '../helpers/validator';
import { userController } from '../controllers';
import passport from '../helpers/passport';

const { createUserSchema, updateUserSchema } = schemas;

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

usersRouter.route('/users').get(getMultipleUsers).post(validateBody(createUserSchema), createUser);
usersRouter
	.route('/users/:userId')
	.get(getOneUser)
	.put(validateBody(updateUserSchema), updateUser)
	.delete(deleteUser);

// Export
export default usersRouter;
