import supertest from 'supertest';
import testHelper from '../../tests/testHelper';
import app from '../app';

const req = supertest(app);
let token;
let ticketId;

beforeAll(async () => {
	token = await testHelper.getToken('admin');
});

const newTicket = {
	title: 'New test ticket',
	description: 'Lorem ipsum',
	priority: 2,
};

const ticketProperties = [
	'title',
	'description',
	'createdBy',
	'status',
	'priority',
	'assignedOperator',
	'course',
];

describe('GET /api/tickets', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.get('/api/tickets');

		expect(status).toBe(401);
		done();
	});

	it('It should return array of tickets', async (done) => {
		const { status, body } = await req
			.get('/api/tickets')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(Array.isArray(body)).toBe(true);

		body.forEach((currentTicket) => {
			ticketProperties.forEach((property) => expect(currentTicket).toHaveProperty(property));
		});

		done();
	});

	it('It should return array with single user object', async (done) => {
		const { status, body } = await req
			.get('/api/tickets?priority=1')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(Array.isArray(body)).toBe(true);

		body.forEach((currentTicket) => {
			ticketProperties.forEach((property) => expect(currentTicket).toHaveProperty(property));
		});

		done();
	});
});

describe('POST /api/tickets', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.post('/api/tickets').send(newTicket);

		expect(status).toBe(401);
		done();
	});

	it('It should return bad request error status code', async (done) => {
		const { status } = await req
			.post('/api/tickets')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(400);
		done();
	});

	it('It should create new ticket', async (done) => {
		const { status, body } = await req
			.post('/api/tickets')
			.set({ Authorization: token, Accept: 'application/json' })
			.send(newTicket);

		expect(status).toBe(201);

		const { _id } = body;
		ticketId = _id;

		ticketProperties.forEach((property) => expect(body).toHaveProperty(property));

		done();
	});
});

describe('GET /api/tickets{ticketId}', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.get(`/api/tickets/${ticketId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should return ticket object', async (done) => {
		const { status, body } = await req
			.get(`/api/tickets/${ticketId}`)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		ticketProperties.forEach((property) => expect(body).toHaveProperty(property));

		done();
	});
});

describe('PUT /api/tickets{ticketId}', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.put(`/api/tickets/${ticketId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should return bad request error status code', async (done) => {
		const { status } = await req
			.put(`/api/tickets/${ticketId}`)
			.set({ Authorization: token, Accept: 'application/json' })
			.send({
				course: [],
			});

		expect(status).toBe(400);
		done();
	});

	it('It should return updated ticket object', async (done) => {
		const ticket = {
			description: 'Updated description',
		};

		const { status, body } = await req
			.put(`/api/tickets/${ticketId}`)
			.set({ Authorization: token, Accept: 'application/json' })
			.send(ticket);

		expect(status).toBe(200);
		ticketProperties.forEach((property) => expect(body).toHaveProperty(property));
		expect(body.description).toBe(ticket.description);

		done();
	});
});

describe('POST /api/tickets{ticketId}/course', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.post(`/api/tickets/${ticketId}/course`);

		expect(status).toBe(401);
		done();
	});

	it('It should return bad request error status code', async (done) => {
		const { status } = await req
			.post(`/api/tickets/${ticketId}/course `)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(400);
		done();
	});

	it('It should add comment to course array and return ticket object', async (done) => {
		const newCourse = { message: 'Test course message' };
		const courseProperties = ['message', 'createdBy'];

		const { status, body } = await req
			.post(`/api/tickets/${ticketId}/course `)
			.set({ Authorization: token, Accept: 'application/json' })
			.send(newCourse);

		expect(status).toBe(200);
		ticketProperties.forEach((property) => expect(body).toHaveProperty(property));
		const { course } = body;

		course.forEach((comment) =>
			courseProperties.forEach((property) => expect(comment).toHaveProperty(property))
		);

		done();
	});
});

describe('DELETE /api/tickets{ticketId}', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.delete(`/api/tickets/${ticketId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should return deleted ticket object', async (done) => {
		const { status, body } = await req
			.delete(`/api/tickets/${ticketId}`)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		ticketProperties.forEach((property) => expect(body).toHaveProperty(property));

		done();
	});
});
