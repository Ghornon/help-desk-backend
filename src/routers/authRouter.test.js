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

describe('/api/auth', () => {
	it('Sign up new user', async (done) => {
		const res = await req.post('/api/auth').send(user).set('Accept', 'application/json');

		expect(res.status).toBe(201);
		expect(res.body.token);

		done();
	});

	it('Login user', async (done) => {
		const res = await req
			.post('/api/auth/login')
			.send({ username: 'admin', password: 'admin' })
			.set('Accept', 'application/json');

		expect(res.status).toBe(200);
		expect(res.body.token);

		done();
	});
});
