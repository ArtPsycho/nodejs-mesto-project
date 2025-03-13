import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

class UserController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await User.findUserByCredentials(email, password);

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).send({ message: 'Секретный ключ не установлен' });
        return;
      }

      const token = jwt.sign(
        { _id: user._id },
        jwtSecret,
        { expiresIn: '30d' },
      );

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).send({ message: 'Успешный вход' });
    } catch (err) {
      next(err);
    }
  }

  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await User.findById(req.params.userId).select('-password');
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      const response = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id.toString(),
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный ID пользователя' });
        return;
      }
      next(error);
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { _id } = req.user;

    try {
      const user = await User.findById(_id).select('-password');
      if (!user) {
        res.status(401).send({ message: 'Требуется авторизация' });
        return;
      }

      const response = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id.toString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password, name, about, avatar } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        name,
        about,
        avatar,
      });
      await newUser.save();
      const userData = await User.findById(newUser._id).select('-password');
      res.status(201).json(userData);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка при создании пользователя: некорректные данные' });
        return;
      }
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, about } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true, select: '-password' },
      );

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка при создании профиля: некорректные данные' });
        return;
      }
      next(error);
    }
  }

  static async updateAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { avatar } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true, select: '-password' },
      );

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка при создании аватара: некорректные данные' });
        return;
      }
      next(error);
    }
  }
}

export default UserController;
