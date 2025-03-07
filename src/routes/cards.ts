import { Router } from 'express';
import CardController from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', CardController.getCards);
cardRouter.post('/', CardController.createCard);
cardRouter.delete('/:cardId', CardController.deleteCard);
cardRouter.put('/:cardId/likes', CardController.likeCard);
cardRouter.delete('/:cardId/likes', CardController.dislikeCard);

export default cardRouter;
