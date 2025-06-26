import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/auth";
import { todoList, todo } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Todo, TodoList } from "@/lib/types"; // Centralized types
import DashboardClient from "./_components/DashboardClient";

export default async function DashboardPage() {

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const user = session.user;

  const listsWithTodos: TodoList[] = await db
    .select()
    .from(todoList)
    .leftJoin(todo, eq(todoList.id, todo.listId))
    .where(eq(todoList.userId, user.id ?? ""))
    .then((rows) => {
      const result: Record<string, TodoList> = {};
      const todoMap: Record<string, Todo & { subtasks?: Todo[] }> = {};
      for (const row of rows) {
        const { todo_list, todo: todoItem } = row;
        if (!result[todo_list.id]) {
          result[todo_list.id] = {
            ...todo_list,
            todos: [],
          };
        }
        if (todoItem) {
          const formattedTodo: Todo & { subtasks?: Todo[] } = {
            ...todoItem,
            completed: Boolean(todoItem.completed),
            subtasks: [],
          };
          todoMap[formattedTodo.id] = formattedTodo;
        }
      }
      // Second pass: assign subtasks to their parents
      Object.values(todoMap).forEach((todo) => {
        if (todo.parentId) {
          if (todoMap[todo.parentId]) {
            todoMap[todo.parentId].subtasks = todoMap[todo.parentId].subtasks || [];
            todoMap[todo.parentId].subtasks!.push(todo);
          }
        }
      });
      // Only top-level todos go in the main todos array
      Object.values(result).forEach((list) => {
        list.todos = Object.values(todoMap).filter(
          (t) => t.listId === list.id && (!t.parentId || t.parentId === null)
        );
      });
      return Object.values(result);
    });

  return <DashboardClient initialLists={listsWithTodos} user={user} />;
}
