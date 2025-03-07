import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

class UserController {
  // Получить всех пользователей
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении пользователей', error });
    }
  }

  // Получить конкретного пользователя по ID
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      // Ищем пользователя по ID
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      // Формируем ответ в нужном формате
      const response = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id.toString(),
      };

      res.status(200).json(response); // Возвращаем ответ
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный ID пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка при получении пользователя' });
    }
  }

  // Создать нового пользователя
  static async createUser(req: Request, res: Response): Promise<void> {
    const { name, about, avatar } = req.body;
    try {
      const newUser = new User({ name, about, avatar });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // Если ошибка является ValidationError, возвращаем статус 400
        res.status(400).send({ message: 'Ошибка при создании пользователя: некорректные данные' });
      } else {
        // Для всех остальных ошибок возвращаем статус 500
        res.status(500).send({ message: 'Ошибка при создании пользователя' });
      }
    }
  }

  // Обновить профиль пользователя
  static async updateProfile(req: Request, res: Response): Promise<void> {
    const { name, about } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true },
      );

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // Если ошибка является ValidationError, возвращаем статус 400
        res.status(400).send({ message: 'Ошибка при создании профиля: некорректные данные' });
      } else {
        // Для всех остальных ошибок возвращаем статус 500
        res.status(500).send({ message: 'Ошибка при создании профиля' });
      }
    }
  }

  // Обновить аватар пользователя
  static async updateAvatar(req: Request, res: Response): Promise<void> {
    const { avatar } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true },
      );

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден!' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        // Если ошибка является ValidationError, возвращаем статус 400
        res.status(400).send({ message: 'Ошибка при создании аватара: некорректные данные' });
      } else {
        // Для всех остальных ошибок возвращаем статус 500
        res.status(500).send({ message: 'Ошибка при создании аватара' });
      }
    }
  }
}

export default UserController;
