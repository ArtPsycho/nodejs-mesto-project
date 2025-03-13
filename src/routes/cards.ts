import { Router } from 'express';
import CardController from '../controllers/cards';
import validation from '../validators/index';

const cardRouter = Router();

cardRouter.get('/', CardController.getCards);
cardRouter.post('/', validation.POST_CARD, CardController.createCard);
cardRouter.delete('/:cardId', validation.DELETE_CARD, CardController.deleteCard);
cardRouter.put('/:cardId/likes', validation.PUT_CARD_LIKE, CardController.likeCard);
cardRouter.delete('/:cardId/likes', validation.DELETE_CARD_LIKE, CardController.dislikeCard);

export default cardRouter;
