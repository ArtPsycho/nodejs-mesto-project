import { celebrate, Joi } from 'celebrate';

const avatarRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=]*)*(#)?$/;

const POST_SIGNIN = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const POST_SIGNUP = celebrate({
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string().uri(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const GET_USER = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

const PATCH_USER = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

const PATCH_AVATAR = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(avatarRegex).required(),
  }),
});

const POST_CARD = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().uri().required(),
  }),
});

const PUT_CARD_LIKE = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

const DELETE_CARD = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

const DELETE_CARD_LIKE = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
});

export default {
  POST_SIGNIN,
  POST_SIGNUP,
  GET_USER,
  PATCH_USER,
  PATCH_AVATAR,
  POST_CARD,
  PUT_CARD_LIKE,
  DELETE_CARD,
  DELETE_CARD_LIKE,
};
