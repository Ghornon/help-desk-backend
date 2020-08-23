import mongoose from 'mongoose';

const connect = async () => {
	if (mongoose.connection.readyState === 0) {
		await mongoose.connect(
			process.env.NODE_ENV === 'test'
				? 'mongodb://localhost:27017/help-desk-test'
				: 'mongodb://localhost:27017/help-desk',
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			}
		);
	}
};

const truncate = async () => {
	if (mongoose.connection.readyState !== 0) {
		const { collections } = mongoose.connection;

		const promises = Object.keys(collections).map((collection) =>
			mongoose.connection.collection(collection).deleteMany({})
		);

		await Promise.all(promises);
	}
};

const disconnect = async () => {
	if (mongoose.connection.readyState !== 0) {
		await mongoose.disconnect();
	}
};

export { connect, truncate, disconnect };
