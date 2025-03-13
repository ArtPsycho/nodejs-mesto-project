import { Router } from 'express';
import UserController from '../controllers/users';
import auth from '../middlewares/auth';
import validation from '../validators/index';

const userRouter = Router();

userRouter.get('/', auth, UserController.getUsers);
userRouter.get('/:userId', auth, validation.GET_USER, UserController.getUser);
userRouter.get('/me', auth, UserController.getCurrentUser);
userRouter.patch('/me', auth, validation.PATCH_USER, UserController.updateProfile);
userRouter.patch('/me/avatar', auth, validation.PATCH_AVATAR, UserController.updateAvatar);

export default userRouter;
