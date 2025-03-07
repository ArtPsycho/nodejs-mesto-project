import { Request, Response } from "express";
import User from "../models/user";

class UserController {
  // Получить всех пользователей
  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении пользователей", error });
    }
  }

  // Получить конкретного пользователя по ID
  static async getUser (req: Request, res: Response): Promise<void> {
    try {
      // Ищем пользователя по ID
      const user = await User.findById(req.params.userId);
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден!" });
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
      res.status(500).json({ message: "Ошибка при получении пользователя", error });
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
      res.status(400).json({ message: "Ошибка при создании пользователя", error });
    }
  }

  // Обновить профиль пользователя
  static async updateProfile(req: Request, res: Response): Promise<void> {
    const { name, about } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({ message: "Пользователь не найден!" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "Ошибка при обновлении профиля", error });
    }
  }

  // Обновить аватар пользователя
  static async updateAvatar(req: Request, res: Response): Promise<void> {
    const { avatar } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({ message: "Пользователь не найден!" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: "Ошибка при обновлении аватара", error });
    }
  }
}

export default UserController;