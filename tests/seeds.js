const users = [
	{
		username: 'admin',
		email: 'admin@email.com',
		password: 'admin',
		repeatPassword: 'admin',
		firstName: 'Admin',
		lastName: 'Admin',
		power: 7,
	},
	{
		username: 'joe.doe1',
		email: 'joe.doe1@email.com',
		password: 'aaa',
		repeatPassword: 'aaa',
		firstName: 'Joe',
		lastName: 'Doe',
		power: 1,
	},
];

const tickets = [
	{ title: 'Test ticket', description: 'Lorem ipsum', priority: 1 },
	{ title: 'Dolor sit amet', description: 'consectetur adipiscing elit', priority: 3 },
];

export default { users, tickets };
