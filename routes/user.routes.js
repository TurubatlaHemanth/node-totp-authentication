import express from 'express';
import { deleteUser, fetchUser, signUpUser, updateUser, fetchAllUser ,loginUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
const userRouter = express.Router();

/* *************** USER CRUD ROUTES *************** */

userRouter.post('/sign-up',      signUpUser);
userRouter.post('/login',        loginUser);
userRouter.get('/getUser',       authenticateToken, fetchUser);
userRouter.delete('/removeUser', deleteUser);
userRouter.patch('/updateUser',  updateUser)
userRouter.get('/fetchAllUser',  fetchAllUser)

export default userRouter;