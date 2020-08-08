import router from 'express-promise-router';
import { validateBody, schemas } from '../helpers/validator';
import userController from '../controllers/userController';

import passport from '../helpers/passport';

const { signUpSchema, authSchema } = schemas;

const { signUp, signIn } = userController;

// Define a router
const userRouter = router();

// Routes
userRouter.route('/').post(validateBody(signUpSchema), signUp);

userRouter
	.route('/auth')
	.post(validateBody(authSchema), passport.authenticate('local', { session: false }), signIn);

// Export
export default userRouter;
