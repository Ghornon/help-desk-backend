import router from 'express-promise-router';
import { validateBody, schemas } from '../helpers/validator';
import userController from '../controllers/userController';

const { signUpSchema } = schemas;

const { signUp } = userController;

// Define a router
const userRouter = router();

// Routes
userRouter.route('/').post(validateBody(signUpSchema), signUp);

// Export
export default userRouter;
