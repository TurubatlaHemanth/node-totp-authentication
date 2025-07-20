import express from 'express'
import { createTask, deleteTask, findTask, fetchAllTasks } from '../controllers/tasks.controller.js';

/** ################### Task Routes ################### **/

const taskRouter = express.Router();

taskRouter.post('/createTask',   createTask);
taskRouter.post('/findTask',     findTask);
taskRouter.delete('/removeTask', deleteTask);
taskRouter.get('/fetchAllTasks', fetchAllTasks)

export default taskRouter;