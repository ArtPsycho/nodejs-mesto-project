import { Router } from 'express';
import CardController from '../controllers/cards';
import validation from '../validators/index';
import auth from '../middlewares/auth';

const cardRouter = Router();

cardRouter.get('/', CardController.getCards);
cardRouter.post('/', auth, validation.POST_CARD, CardController.createCard);
cardRouter.delete('/:cardId', auth, validation.DELETE_CARD, CardController.deleteCard);
cardRouter.put('/:cardId/likes', auth, validation.PUT_CARD_LIKE, CardController.likeCard);
cardRouter.delete('/:cardId/likes', auth, validation.DELETE_CARD_LIKE, CardController.dislikeCard);

export default cardRouter;
