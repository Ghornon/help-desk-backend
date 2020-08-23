import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { connect } from './helpers/database';
import { authRouter, usersRouter } from './routers';

class App {
	constructor() {
		this.express = express();
		connect();

		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.express.use(morgan('dev'));
		this.express.use(bodyParser.json());
	}

	routes() {
		this.express.get('/', (req, res) => {
			res.status(200).send('Hello world!');
		});

		const swaggerDocument = YAML.load('./swagger.yaml');
		this.express.use(
			'/api/docs',
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument, {
				explorer: true,
			})
		);

		this.express.use('/api/', authRouter, usersRouter);
	}
}

const app = new App().express;
export default app;
