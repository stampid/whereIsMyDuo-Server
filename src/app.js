import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import csurf from 'csurf';
import socketIo from 'socket.io';
import helmet from 'helmet';
import dotenv from 'dotenv';
import redis from 'redis';
import router from './router/router';
import socketController from './socket/socketController';

dotenv.config();

const app = express();
const { PORT } = process.env || 5000;

const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', (req, res, next) => {
	req.redis_client = redisClient;
	next();
});

app.use('/', router);

const server = app.listen(PORT, () => {
	console.log(`Server On : ${PORT}`);
});

const io = socketIo.listen(server);

io.on('connection', (socket) => socketController(socket));
