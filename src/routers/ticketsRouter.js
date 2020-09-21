import router from 'express-promise-router';
import passport from '../helpers/passport';
import accessGuard from '../helpers/accessGuard';

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
	.get(accessGuard('owner'), getMultipleTickets)
	.post(validateBody(createTicketSchema), createTicket);

ticketsRouter
	.route('/tickets/:ticketId')
	.get(accessGuard('owner'), getOneTicket)
	.put(accessGuard('mod'), validateBody(updateTicketSchema), updateTicket)
	.delete(accessGuard('admin'), deleteTicket);

ticketsRouter
	.route('/tickets/:ticketId/course')
	.post(accessGuard('owner'), validateBody(curseSchema), addComment);

// Export
export default ticketsRouter;
