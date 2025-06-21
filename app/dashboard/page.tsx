import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/auth";
import { todoList, todo } from "@/db/schema";
import { eq, isNull, and, inArray } from "drizzle-orm";
import type { Todo, TodoList } from "@/lib/types"; // Centralized types
import DashboardClient from "./_components/DashboardClient";
// import { FaChevronDown } from "react-icons/fa";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth");
  }

  const user = session.user;

  const rawTodos = await db
    .select()
    .from(todoList)
    .leftJoin(
      todo,
      and(eq(todoList.id, todo.listId), isNull(todo.parentTodoId))
    )
    .where(eq(todoList.userId, user.id ?? ""));

  const listsMap: Record<string, TodoList> = {};
  const mainTodoIds: string[] = [];

  for (const row of rawTodos) {
    const { todo_list, todo: todoItem } = row;
    if (!listsMap[todo_list.id]) {
      listsMap[todo_list.id] = {
        ...todo_list,
        todos: [],
      };
    }
    if (todoItem) {
      const formattedTodo: Todo = {
        ...todoItem,
        completed: Boolean(todoItem.completed),
        subtodos: [], // will be filled later
      };
      listsMap[todo_list.id].todos.push(formattedTodo);
      mainTodoIds.push(todoItem.id);
    }
  }

  // Fetch subtodos
  let subtodoMap: Record<string, Todo[]> = {};
  if (mainTodoIds.length > 0) {
    const subtodoRows = await db
      .select()
      .from(todo)
      .where(inArray(todo.parentTodoId, mainTodoIds));

    for (const sub of subtodoRows) {
      if (!sub.parentTodoId) continue; // skip if null or undefined

      const formattedSub: Todo = {
        id: sub.id,
        userId: sub.userId,
        content: sub.content,
        completed: Boolean(sub.completed),
        listId: sub.listId,
        parentTodoId: sub.parentTodoId,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      };

      if (!subtodoMap[sub.parentTodoId]) {
        subtodoMap[sub.parentTodoId] = [];
      }
      subtodoMap[sub.parentTodoId].push(formattedSub);
    }
  }

  // Attach subtodos
  for (const list of Object.values(listsMap)) {
    list.todos = list.todos.map((todo) => ({
      ...todo,
      subtodos: subtodoMap[todo.id] ?? [],
    }));
  }

  const listsWithTodos: TodoList[] = Object.values(listsMap);

  return <DashboardClient initialLists={listsWithTodos} user={user} />;
}
