import express from 'express';
import { signin, signout, signup } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);

userRouter.post('/signin', signin);

userRouter.get('/signout', signout);

export default userRouter;