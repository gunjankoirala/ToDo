import express from 'express';
import * as todoController from '../controllers/todoController';
import * as userController from '../controllers/userController';
import { verifyToken } from '../verifyToken';

const router = express.Router();

router.get('/todos', todoController.getTodos);
// router.post('/todos', todoController.addTodo);
// router.put('/todos/:id', todoController.editTodo);
// router.delete('/todos/:id', todoController.removeTodo);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.post('/todos', verifyToken, todoController.addTodo);
router.put('/todos/:id', verifyToken, todoController.editTodo);
router.delete('/todos/:id', verifyToken, todoController.removeTodo);
export default router;  