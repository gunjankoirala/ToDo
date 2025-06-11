import { Request, Response } from 'express';
import * as TodoModel from '../models/todoModel';
import { error } from 'console';

export async function getTodos  (req: Request, res : Response) {
    const todos = await TodoModel.getAllTodos();
  res.json(todos);
}

export async function addTodo ( req: Request, res:Response) {
    const {task} = req.body;

// if(!task){
//     return res.status(400).json({error:'Task is required'});
// }
const newTodo = TodoModel.createTodo(task);
res.status(201).json(newTodo);
};

export async function editTodo (req :Request, res: Response){
    const id = Number(req.params.id);
    const{task , completed}= req.body;
     const updatedTodo = TodoModel.updateTodo(id ,task, completed);
    //  if (!updatedTodo)
    //  {
    //     return res.status(404).json({error:'Todo not found'})
    //  }
     res.json(updatedTodo);
};

 export async function removeTodo ( req:Request , res:Response) {
    const id = Number(req.params.id);
    const deleted = TodoModel.deleteTodo(id);
    // if(!deleted){
    //     return res.status(404).json({error:'Todo not found'});
    // }
    res.status(204).send();
 };