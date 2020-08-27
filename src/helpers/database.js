import mongoose from 'mongoose';
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

const connect = async () => {
	let uri = 'mongodb://localhost:27017/help-desk';
	const mongooseOpts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	if (process.env.NODE_ENV === 'test') uri = await mongod.getConnectionString();

	await mongoose.connect(uri, mongooseOpts);
};

const truncate = async () => {
	const { collections } = mongoose.connection;

	const promises = Object.keys(collections).map((collection) =>
		mongoose.connection.collection(collection).deleteMany({})
	);

	await Promise.all(promises);
};

const disconnect = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongod.stop();
};

export { connect, truncate, disconnect };
