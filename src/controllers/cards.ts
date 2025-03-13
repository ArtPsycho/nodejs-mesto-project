import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

class CardController {
  // Получение всех карточек
  async getCards(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await Card.find();
      res.status(200).send(cards);
    } catch (error) {
      next(error);
    }
  }

  // Создание новой карточки
  async createCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, link } = req.body;

    try {
      const card = await Card.create({
        name,
        link,
        owner: req.user._id,
      });
      res.status(201).send(card);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Ошибка при создании карточки: некорректные данные' });
        return;
      }
      next(error);
    }
  }

  // Удаление карточки
  async deleteCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const card = await Card.findById(req.params.cardId);

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      if (String(card.owner) !== String(req.user._id)) {
        res.status(403).send({ message: 'Нет прав для удаления этой карточки' });
        return;
      }

      await Card.findByIdAndRemove(req.params.cardId);
      res.status(200).send({ message: 'Карточка удалена' });
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }
      next(error);
    }
  }

  // Лайк карточки
  async likeCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const card = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      );

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }
      next(error);
    }
  }

  // Дизлайк карточки
  async dislikeCard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const card = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Некорректный ID карточки' });
        return;
      }
      next(error);
    }
  }
}

export default new CardController();