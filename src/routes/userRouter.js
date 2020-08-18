import router from 'express-promise-router';

import { validateBody, schemas } from '../helpers/validator';
import userController from '../controllers/userController';
import passport from '../helpers/passport';

const { UserSchema, authSchema } = schemas;

const { signUp, signIn, getUsers, getUserById } = userController;

const userRouter = router();

userRouter.route('/').post(validateBody(UserSchema), signUp);

userRouter
	.route('/auth')
	.post(validateBody(authSchema), passport.authenticate('local', { session: false }), signIn);

userRouter.route('/').get(passport.authenticate('jwt', { session: false }), getUsers);

userRouter.route('/:userId').get(passport.authenticate('jwt', { session: false }), getUserById);

// userRouter.param('userId', getUserById);

// Export
export default userRouter;
