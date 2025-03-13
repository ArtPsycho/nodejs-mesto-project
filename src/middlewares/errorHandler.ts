import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if ((err as any).code === 11000) {
    return res.status(409).send({ message: 'Пользователь с таким email уже существует.' });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ message: 'Необходима авторизация.' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка.' });
};

export default errorHandler;
