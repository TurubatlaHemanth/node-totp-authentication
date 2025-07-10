import express from 'express';
import { deleteUser, fetchUser, signUpUser, updateUser, fetchAllUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

/* *************** USER CRUD ROUTES *************** */

userRouter.post('/sign-up',      signUpUser);
userRouter.get('/getUser',       fetchUser);
userRouter.delete('/removeUser', deleteUser);
userRouter.patch('/updateUser',  updateUser)
userRouter.get('/fetchAllUser',  fetchAllUser)

export default userRouter;