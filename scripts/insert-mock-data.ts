import { db } from "../db";
import { user, todoList, todo } from "../db/schema";

async function main() {
  await db.insert(user).values({
    id: "mock-user-id",
    name: "Mock User",
    email: "test@example.com",
    emailVerified: new Date().toISOString(),
    image: null,
  });
  await db.insert(todoList).values({
    id: "list-1",
    name: "Sample List",
    userId: "mock-user-id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  await db.insert(todo).values({
    id: "todo-1",
    content: "Sample Todo",
    completed: 0,
    userId: "mock-user-id",
    listId: "list-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("Mock user, list, and todo inserted!");
}

main().then(() => process.exit(0)); 