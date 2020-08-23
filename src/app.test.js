import supertest from 'supertest';
import app from './app';
import { disconnect, truncate } from './helpers/database';

const req = supertest(app);

beforeAll(async () => {
	await truncate();
});

afterAll(async () => {
	await disconnect();
});

it('Testing to see if Jest works', () => {
	expect(1).toBe(1);
});

it('Gets the root endpoint', async (done) => {
	const res = await req.get('/');

	expect(res.status).toBe(200);
	done();
});
