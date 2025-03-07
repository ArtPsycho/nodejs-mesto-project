import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';

const { PORT = 3000 } = process.env;

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

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '67c9a36747057effdc3114af',
  };

  next();
});

app.use(express.json());

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req: Request, res: Response) => {
  res.status(404).send({ message: 'Упс. Ошибочка 404. К сожалению, не удалось найти запрошенный URL на нашем сервере🥺' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
