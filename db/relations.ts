import { relations } from "drizzle-orm/relations";
import {
  user,
  account,
  authenticator,
  session,
  todoList,
  todo,
} from "./schema";

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  authenticators: many(authenticator),
  sessions: many(session),
  todoLists: many(todoList),
}));

export const authenticatorRelations = relations(authenticator, ({ one }) => ({
  user: one(user, {
    fields: [authenticator.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const todoRelations = relations(todo, ({ one }) => ({
  todoList: one(todoList, {
    fields: [todo.listId],
    references: [todoList.id],
  }),
}));

export const todoListRelations = relations(todoList, ({ one, many }) => ({
  todos: many(todo),
  user: one(user, {
    fields: [todoList.userId],
    references: [user.id],
  }),
}));
