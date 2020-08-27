import { connect, truncate, disconnect } from '../src/helpers/database';
import testHelper from './testHelper';

beforeAll(async () => {
	await connect();
	await truncate();
	await testHelper.seedUserCollection();
});

afterAll(() => {
	return disconnect();
});
