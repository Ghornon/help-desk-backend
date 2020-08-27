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

	async getToken() {
		if (!this.seeds.users && !this.seeds.users.length) {
			return null;
		}
		const { username } = this.seeds.users[0];

		const { _id } = await UserModel.findOne({ username }).select('_id').exec();

		return signToken(_id);
	}
}

export default new TestHelper();
