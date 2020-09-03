import UserModel from '../src/models/userModel';
import { genHash, signToken } from '../src/helpers/auth';

import seeds from './seeds';

class TestHelper {
	constructor() {
		this.seeds = {
			...seeds,
		};
	}

	async seedUserCollection() {
		const promises = [...this.seeds.users].map(({ password }) => genHash(password));
		const hashes = await Promise.all(promises);

		const newUsers = [...this.seeds.users].map(
			({ username, email, firstName, lastName, power = 1 }, index) => {
				return { username, email, password: hashes[index], firstName, lastName, power };
			}
		);

		await UserModel.insertMany(newUsers);
	}

	async seedDatabase() {
		await this.seedUserCollection();
	}

	async getToken(username, customPower) {
		if (!this.seeds.users && !this.seeds.users.length) {
			return null;
		}

		const { _id, power } = await UserModel.findOne({
			username: username || this.seeds.users[0],
		}).exec();

		return signToken(_id, customPower || power);
	}
}

export default new TestHelper();
