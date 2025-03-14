import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  _id: string;
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload;

  next();
};

export default auth;
