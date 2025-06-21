"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auth } from "@/auth";
import { todoList, todo } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const addListSchema = z.object({
  name: z.string().min(1, "List name cannot be empty.").max(100),
});
const addTodoSchema = z.object({
  content: z.string().min(1, "Todo content cannot be empty.").max(280),
  listId: z.string(),
  parentTodoId: z.string().optional().nullable(),
});
const toggleTodoSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
});
const deleteTodoSchema = z.object({
  id: z.string(),
});

const getUserId = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
};

export async function addListAction(formData: FormData) {
  const userId = await getUserId();
  const rawData = { name: formData.get("newListName") as string };

  const validation = addListSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.format().name?._errors[0] };
  }

  try {
    const newList = {
      id: `list-${nanoid(10)}`,
      name: validation.data.name,
      userId,
    };
    await db.insert(todoList).values(newList);
    revalidatePath("/dashboard");
    return { data: newList };
  } catch (error) {
    console.error("Error creating list:", error);
    return { error: "Failed to create list." };
  }
}

export async function addTodoAction(formData: FormData) {
  const userId = await getUserId();
  const rawData = {
    content: formData.get("newTodoContent") as string,
    listId: formData.get("activeListId") as string,
    parentTodoId: formData.get("parentTodoId") as string,
  };

  const validation = addTodoSchema.safeParse(rawData);
  if (!validation.success) {
    return { error: validation.error.format().content?._errors[0] };
  }

  try {
    const newTodo = {
      id: `todo-${nanoid(10)}`,
      content: validation.data.content,
      listId: validation.data.listId,
      userId,
      parentTodoId: validation.data.parentTodoId,
    };
    await db.insert(todo).values(newTodo);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error adding todo:", error);
    return { error: "Failed to add todo." };
  }
}

export async function toggleTodoAction(id: string, completed: boolean) {
  const userId = await getUserId();
  const validation = toggleTodoSchema.safeParse({ id, completed });
  if (!validation.success) return;

  await db
    .update(todo)
    .set({ completed: completed ? 1 : 0 })
    // Extra security: ensure the todo belongs to the current user
    .where(and(eq(todo.id, id), eq(todo.userId, userId)));

  revalidatePath("/dashboard");
}

export async function deleteTodoAction(id: string) {
  const userId = await getUserId();
  const validation = deleteTodoSchema.safeParse({ id });
  if (!validation.success) return;

  await db.delete(todo).where(and(eq(todo.id, id), eq(todo.userId, userId)));

  revalidatePath("/dashboard");
}
