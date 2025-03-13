import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import UserController from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import validation from './validators/index';

const { PORT = 3000 } = process.env;

require('dotenv').config();

const app = express();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

// Настройка CORS для определенных источников
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(requestLogger);

app.post('/signin', validation.POST_SIGNIN, UserController.login);
app.post('/signup', validation.POST_SIGNUP, UserController.createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Упс. Ошибочка 404. К сожалению, не удалось найти запрошенный URL на нашем сервере🥺' });
});

app.use(errorLogger);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
