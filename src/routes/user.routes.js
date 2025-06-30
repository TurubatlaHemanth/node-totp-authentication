import express from 'express';
import { fetchUser, signUpUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/sign-up', signUpUser);
userRouter.get('/getuser', fetchUser);

export default userRouter;