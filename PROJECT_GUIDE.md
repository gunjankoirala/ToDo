## 1. Workflow Overview

Todos CRUD (Add / Get / Update / Delete)
### SignUp
**How it works:**
1. User sends `email` and `password` to `SignUp` mutation.
2. Server checks if email already exists in the database.
3. If no user exists, password is hashed using `bcrypt`.
4. New user is inserted with a UUID as `id`.
5. Server returns: `"User registered successfully"`.



### Login
**How it works:**
1. User sends `email` and `password` to `login` mutation.
2. Server finds user by email.
3. Password is verified using `bcrypt.compare`.
4. If valid, a JWT token is generated containing `userId`.
5. Server returns message + token for authenticated requests.



### Authentication
**How it works:**
1. Client sends requests with JWT token in `Authorization` header:
2. Server extracts and verifies the token.
3. If valid, `context.userId` is set for resolvers.
4. If invalid/missing, operations return `"Unauthorized"` error.


### Add Todo
**How it works:**
1. Authenticated user sends `task` to `addTodo` mutation.
2. Server inserts a new todo with:
   - `task` = user input
   - `completed` = false
   - `userId` = logged-in user
3. Returns the inserted todo with ID and details.



### Get Todos
**How it works:**
1. Authenticated user sends `todos` query.
2. Server selects all todos from `todo` table where `userId` matches logged-in user.
3. Returns an array of todos.


### Update Todo
**How it works:**
1. Authenticated user sends `id` and optionally `task` or `completed` to `updateTodo`.
2. Server checks if the todo belongs to the user.
3. Updates only the provided fields.
4. Returns updated todo, or `"Forbidden"` if user doesn’t own it.


### Delete Todo
**How it works:**
1. Authenticated user sends `id` to `deleteTodo`.
2. Server checks ownership.
3. Deletes the todo if it belongs to the user.
4. Returns `true` if deletion succeeds, otherwise `false`.