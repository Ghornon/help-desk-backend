import supertest from 'supertest';
import testHelper from '../../tests/testHelper';
import app from '../app';

const req = supertest(app);

let user = {
	username: 'test.user',
	email: 'test@email.com',
	password: 'aaa',
	repeatPassword: 'aaa',
	firstName: 'Test',
	lastName: 'Test',
	power: 1,
};

let token;
let userId;

beforeAll(async () => {
	token = await testHelper.getToken('admin');
});

describe('GET /api/users', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.get('/api/users');

		expect(status).toBe(401);
		done();
	});

	it('It should return array of users', async (done) => {
		const { status, body } = await req
			.get('/api/users')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(Array.isArray(body)).toBe(true);

		body.forEach((currentUser) => {
			Object.keys(user).forEach((key) => {
				if (key === 'password' || key === 'repeatPassword')
					return expect(currentUser).not.toHaveProperty(key);
				return expect(currentUser).toHaveProperty(key);
			});
		});

		done();
	});

	it('It should return array with single user object', async (done) => {
		const { status, body } = await req
			.get('/api/users?username=admin')
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
});

describe('POST /api/users', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.post('/api/users').send(user);

		expect(status).toBe(401);
		done();
	});

	it('It should return bad request error status code', async (done) => {
		const { status } = await req
			.post('/api/users')
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(400);
		done();
	});

	it('It should create new user', async (done) => {
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
});

describe('GET /api/users/:id', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.get(`/api/users/${userId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should return forbidden error status code', async (done) => {
		const tokenWithoutAccess = await testHelper.getToken('joe.doe1');

		const { status } = await req
			.get(`/api/users/${userId}`)
			.set({ Authorization: tokenWithoutAccess, Accept: 'application/json' });

		expect(status).toBe(403);
		done();
	});

	it('It should get user by the given id when logged user id is the same', async (done) => {
		const tokenWithSelfAccess = await testHelper.getToken(user.username);

		const { status, body } = await req
			.get(`/api/users/${userId}`)
			.set({ Authorization: tokenWithSelfAccess, Accept: 'application/json' });

		expect(status).toBe(200);

		Object.keys(user).forEach((key) => {
			if (key === 'password' || key === 'repeatPassword')
				return expect(body).not.toHaveProperty(key);
			return expect(body).toHaveProperty(key);
		});

		done();
	});

	it('It should get user by the given id', async (done) => {
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
});

describe('PUT /api/users/:id', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.put(`/api/users/${userId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should return bad request error status code', async (done) => {
		const updatedUser = {
			badProperty: null,
		};

		const { status } = await req
			.put(`/api/users/${userId}`)
			.send(updatedUser)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(400);
		done();
	});

	it('It should update user by the given id', async (done) => {
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
});

describe('DELETE /api/users/:id', () => {
	it('It should return unauthorize error status code', async (done) => {
		const { status } = await req.delete(`/api/users/${userId}`);

		expect(status).toBe(401);
		done();
	});

	it('It should delete user by the given id', async (done) => {
		const { status, body } = await req
			.delete(`/api/users/${userId}`)
			.set({ Authorization: token, Accept: 'application/json' });

		expect(status).toBe(200);
		expect(body).toBeDefined();

		done();
	});
});
