export type Todo = {
  id: string;
  userId: string;
  content: string;
  completed: boolean;
  listId: string;
  parentTodoId?: string | null;
  subtodos?: Todo[];
  createdAt: string;
  updatedAt: string;
};

// export type SubTodo = {
//   id: string;
//   content: string;
//   completed: boolean;
//   parentTodoId: string;
//   createdAt: string;
//   updatedAt: string;
// };

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
