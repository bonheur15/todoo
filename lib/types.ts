export type Todo = {
  id: string;
  content: string;
  completed: boolean;
  listId: string;
  subTodos: SubTodo[];
};

export type SubTodo = {
  id: string;
  content: string;
  completed: boolean;
  todoId:string;
};

export type TodoList = {
  id: string;
  name: string;
  userId: string;
  todos: Todo[];
};

/// for mock user data
export type User = {
  id: string;
  name?: string | null;
  email?: string | null; // Optional, but good to have from session
  image?: string | null; // Optional, but good to have from session
};
