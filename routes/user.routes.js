import express from 'express';
import { deleteUser, fetchUser, signUpUser, updateUser, fetchAllUser ,loginUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { verifyTotp } from '../middlewares/verifyTotp.js'
const userRouter = express.Router();

/* *************** USER CRUD ROUTES *************** */

userRouter.post('/sign-up',      signUpUser);
userRouter.post('/login',        loginUser,         verifyTotp);
userRouter.get('/getUser',       authenticateToken, fetchUser);
userRouter.delete('/removeUser', authenticateToken, deleteUser);
userRouter.put('/updateUser',    authenticateToken, updateUser);
userRouter.get('/fetchAllUser',  authenticateToken, fetchAllUser);

userRouter.post('/verifyTotp',   verifyTotp);

export default userRouter;