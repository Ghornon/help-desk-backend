import express from 'express';

import bodyParser from 'body-parser';

import chalk from 'chalk';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
	res.send('hello world!!');
});

/* eslint no-console: 0 */

const port = process.env.port || 8080;

app.listen(port, () =>
	console.log(chalk.green('[Info]'), `Test app listening on port ${chalk.blue.bold(port)}!`)
);
