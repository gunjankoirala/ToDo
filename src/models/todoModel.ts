export interface Todo{
    id : number;
    task : string;
    completed : boolean;

}

let todos: Todo[] =[];
let nextId = 1;

export const getAllTodos =():Todo[]=>todos;  

export const createTodo = (task:string) :Todo =>{
    const newTodo = {id:nextId++,task,completed:false}; 
    todos.push(newTodo);
    return newTodo;
};

export const updateTodo = (id :number, task?:string, completed?:boolean) : Todo | undefined =>{
    const todo = todos.find(t =>t.id ===id);
    if(!todo)
        return undefined;
    if(task !==undefined) todo.task = task;
    if(completed!== undefined) todo.completed = completed;
    return todo;
};

export const deleteTodo = (id: number): boolean =>{
    const initialLength = todos.length;
    todos = todos.filter(t=>t.id !== id);
    return todos.length<initialLength;
};