import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/auth";
import { todoList, todo } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Todo, TodoList } from "@/lib/types"; // Centralized types
import DashboardClient from "./_components/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  console.log("Session:", session);
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
      for (const row of rows) {
        const { todo_list, todo: todoItem } = row;
        if (!result[todo_list.id]) {
          result[todo_list.id] = {
            ...todo_list,
            todos: [],
          };
        }
        if (todoItem) {
          const formattedTodo: Todo = {
            ...todoItem,
            completed: Boolean(todoItem.completed),
          };
          result[todo_list.id].todos.push(formattedTodo);
        }
      }
      return Object.values(result);
    });

  return <DashboardClient initialLists={listsWithTodos} user={user} />;
}
