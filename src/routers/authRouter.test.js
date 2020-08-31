import supertest from 'supertest';
import app from '../app';

const req = supertest(app);

const user = {
	username: 'test.user',
	email: 'test@email.com',
	password: 'aaa',
	repeatPassword: 'aaa',
	firstName: 'Test',
	lastName: 'Test',
};

describe('POST /api/auth', () => {
	it('It should return bad request error status code', async (done) => {
		const { status, body } = await req
			.post('/api/auth')
			.send({})
			.set('Accept', 'application/json');

		expect(status).toBe(400);
		expect(body.token);

		done();
	});

	it('It should sign up new user', async (done) => {
		const { status, body } = await req
			.post('/api/auth')
			.send(user)
			.set('Accept', 'application/json');

		expect(status).toBe(201);
		expect(body.token);

		done();
	});
});

describe('POST /api/auth/login', () => {
	it('It should return bad request error status code', async (done) => {
		const { status } = await req
			.post('/api/auth/login')
			.send({})
			.set('Accept', 'application/json');

		expect(status).toBe(400);

		done();
	});

	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req
			.post('/api/auth/login')
			.send({ username: 'admin', password: 'asd123' })
			.set('Accept', 'application/json');

		expect(status).toBe(401);

		done();
	});

	it('It should login user', async (done) => {
		const { status, body } = await req
			.post('/api/auth/login')
			.send({ username: 'admin', password: 'admin' })
			.set('Accept', 'application/json');

		expect(status).toBe(200);
		expect(body.token);

		done();
	});
});
