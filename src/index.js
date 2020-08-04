import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import chalk from 'chalk';

import usersRoutes from './routes/userRouter';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
	res.send('hello world!!');
});

app.use('/api/users', usersRoutes);

mongoose.connect('mongodb://localhost:27017/help-desk', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const port = process.env.port || 8080;

app.listen(
	port,
	() => console.log(chalk.green('[Info]'), `Test app listening on port ${chalk.blue.bold(port)}!`) // eslint-disable-line
);
