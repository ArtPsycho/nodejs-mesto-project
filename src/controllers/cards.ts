import { Request, Response } from 'express';
import Card from "../models/card";

class CardController {
  // Получение всех карточек
  async getCards(req: Request, res: Response) {
    try {
      const cards = await Card.find();
      res.status(200).send(cards);
    } catch (error) {
      res.status(500).send({ message: 'Ошибка при получении карточек' });
    }
  }

  // Создание новой карточки
  async createCard(req: Request, res: Response) {
    const {name, link } = req.body;

    try {
      const card = await Card.create({
        name,
        link,
        owner: req.user._id
      });
      res.status(201).send(card);
    } catch (error) {
      res.status(400).send({ message: 'Ошибка при создании карточки' });
    }
  }

  // Удаление карточки
  async deleteCard(req: Request, res: Response): Promise<void> {
    try {
      const card = await Card.findByIdAndRemove(req.params.cardId);

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      if (String(card.owner) !== String(req.user._id)) {
        res.status(403).send({ message: 'Нет прав для удаления этой карточки' });
        return;
      }

      res.status(200).send({ message: 'Карточка удалена' });
    } catch (error) {
      res.status(500).send({ message: 'Ошибка при удалении карточки' });
    }
  }

  // Лайк карточки
  async likeCard(req: Request, res: Response): Promise<void> {
    try {
      const card = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      );

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    } catch (error) {
      res.status(500).send({ message: 'Ошибка при лайке карточки' });
    }
  }

  // Дизлайк карточки
  async dislikeCard(req: Request, res: Response): Promise<void> {
    try {
      const card = await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      res.status(200).send(card);
    } catch (error) {
      res.status(500).send({ message: 'Ошибка при дизлайке карточки' });
    }
  }
}

export default new CardController();