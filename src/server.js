import chalk from 'chalk';
import app from './app';

const port = process.env.port || 8080;

app.listen(
	port,
	() => console.log(chalk.green('[Info]'), `Test app listening on port ${chalk.blue.bold(port)}!`) // eslint-disable-line
);
