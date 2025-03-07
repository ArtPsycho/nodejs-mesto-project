import {Router} from "express";
import UserController from "../controllers/users";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/:userId", UserController.getUser);
userRouter.post("/", UserController.createUser );
userRouter.patch('/me', UserController.updateProfile);
userRouter.patch('/me/avatar', UserController.updateAvatar);

export default userRouter;