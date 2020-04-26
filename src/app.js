import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import socketIo from 'socket.io';
import helmet from 'helmet';
import dotenv from 'dotenv';
import router from './router/router';
import socketController from './socket/socketController';

dotenv.config();

const app = express();
const { PORT } = process.env || 5000;

app.use(morgan('dev'));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
	cors({
		origin: ['*'],
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		credentials: true,
	}),
);

app.use('/', router);

const server = app.listen(PORT, () => {
	console.log(`Server On : ${PORT}`);
});

const io = socketIo.listen(server);

io.on('connection', (socket) => socketController(socket));
