import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/auth";
import { todoList, todo, subTodo } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Todo, TodoList } from "@/lib/types"; // Centralized types
import DashboardClient from "./_components/DashboardClient";
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth");

  const user = session.user;

  const listsWithTodos: TodoList[] = await db
    .select()
    .from(todoList)
    .leftJoin(todo, eq(todoList.id, todo.listId))
    .leftJoin(subTodo, eq(todo.id, subTodo.todoId))
    .where(eq(todoList.userId, user.id ?? ""))
    .then((rows) => {
      const result: Record<string, TodoList> = {};
      
      for (const row of rows) {
        const { todo_list, todo: todoItem, subTodo: subTodoItem } = row;

        // Initialize list if not exists
        if (!result[todo_list.id]) {
          result[todo_list.id] = { ...todo_list, todos: [] };
        }

        // Skip if no todo exists (left join edge case)
        if (!todoItem) continue;

        // Find or create the parent todo
        let parentTodo = result[todo_list.id].todos.find(t => t.id === todoItem.id);
        if (!parentTodo) {
          parentTodo = { 
            ...todoItem, 
            completed: Boolean(todoItem.completed),
            subTodos: [] // Add subTodos array
          };
          result[todo_list.id].todos.push(parentTodo);
        }
        // Add subtodo if it exists
        if (subTodoItem) {
          parentTodo.subTodos!.push({
            ...subTodoItem,
            completed: Boolean(subTodoItem.completed)
          });
        }
      }
      return Object.values(result);
    });

  return <DashboardClient initialLists={listsWithTodos} user={user} />;
}