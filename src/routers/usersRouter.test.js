import supertest from 'supertest';
import testHelper from 'tests/testHelper';
import app from '../app';

const req = supertest(app);

let user = {
	username: 'test.user',
	email: 'test@email.com',
	password: 'aaa',
	repeatPassword: 'aaa',
	firstName: 'Test',
	lastName: 'Test',
	power: 5,
};

let token;
let userId;

beforeAll(async () => {
	token = await testHelper.getToken();
});

describe('/api/users', () => {
	it('GET multiple users', async (done) => {
		const { status, body } = await req
			.get('/api/users')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(Array.isArray(body)).toBe(true);

		Object.keys(user).forEach((key) => {
			if (key === 'password' || key === 'repeatPassword')
				return expect(body[0]).not.toHaveProperty(key);
			return expect(body[0]).toHaveProperty(key);
		});

		done();
	});

	it('POST user', async (done) => {
		const { status, body } = await req
			.post('/api/users')
			.send(user)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(201);
		expect(body).toHaveProperty('power', user.power);

		const { _id } = body;
		userId = _id;

		done();
	});

	it('GET user by id', async (done) => {
		const { status, body } = await req
			.get(`/api/users/${userId}`)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);

		Object.keys(user).forEach((key) => {
			if (key === 'password' || key === 'repeatPassword')
				return expect(body).not.toHaveProperty(key);
			return expect(body).toHaveProperty(key);
		});

		done();
	});

	it('PUT user', async (done) => {
		const updatedUser = {
			username: 'updated.user',
			password: 'aaa123',
			repeatPassword: 'aaa123',
			power: 7,
		};

		user = {
			...user,
			...updatedUser,
		};

		const { status, body } = await req
			.put(`/api/users/${userId}`)
			.send(updatedUser)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);

		Object.keys(user).forEach((key) => {
			if (key === 'password' || key === 'repeatPassword')
				return expect(body).not.toHaveProperty(key);
			return expect(body).toHaveProperty(key, user[key]);
		});

		done();
	});

	it('Login user', async (done) => {
		const { username, password } = user;
		const { status, body } = await req
			.post('/api/auth/login')
			.send({ username, password })
			.set('Accept', 'application/json');

		expect(status).toBe(200);
		expect(body).toHaveProperty('token');

		done();
	});

	it('DELETE user', async (done) => {
		const { status, body } = await req
			.delete(`/api/users/${userId}`)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(body).toBeDefined();

		done();
	});
});
