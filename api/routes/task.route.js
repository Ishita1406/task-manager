import express from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/task.controller.js';

const taskRouter = express.Router();

taskRouter.post('/create', createTask);

taskRouter.get('/get', getTasks);

taskRouter.put('/update/:id', updateTask);

taskRouter.delete('/delete/:id', deleteTask);

export default taskRouter;