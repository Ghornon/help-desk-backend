import router from 'express-promise-router';
import passport from '../helpers/passport';

import {
	getTicketById,
	getOneTicket,
	getMultipleTickets,
	createTicket,
	updateTicket,
	deleteTicket,
	addComment,
} from '../controllers/ticketsController';

import { validateBody, bodySchemas } from '../helpers/validator';

const { createTicketSchema, updateTicketSchema, curseSchema } = bodySchemas;

const ticketsRouter = router();
ticketsRouter.use(passport.authenticate('jwt', { session: false }));
ticketsRouter.param('ticketId', getTicketById);

ticketsRouter
	.route('/tickets')
	.get(getMultipleTickets)
	.post(validateBody(createTicketSchema), createTicket);

ticketsRouter
	.route('/tickets/:ticketId')
	.get(getOneTicket)
	.put(validateBody(updateTicketSchema), updateTicket)
	.delete(deleteTicket);

ticketsRouter.route('/tickets/:ticketId/curse').post(validateBody(curseSchema), addComment);

// Export
export default ticketsRouter;
