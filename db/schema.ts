import { sql } from "drizzle-orm";
import {
  mysqlTable,
  varchar,
  int,
  unique,
  timestamp,
  text,
  tinyint,
} from "drizzle-orm/mysql-core";

export const account = mysqlTable("account", {
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: varchar({ length: 255 }).notNull(),
  provider: varchar({ length: 255 }).notNull(),
  providerAccountId: varchar({ length: 255 }).notNull(),
  refreshToken: varchar("refresh_token", { length: 255 }).default("NULL"),
  accessToken: varchar("access_token", { length: 255 }).default("NULL"),
  expiresAt: int("expires_at").default(0),
  tokenType: varchar("token_type", { length: 255 }).default("NULL"),
  scope: varchar({ length: 255 }).default("NULL"),
  idToken: varchar("id_token", { length: 2048 }).default("NULL"),
  sessionState: varchar("session_state", { length: 255 }).default("NULL"),
});

export const authenticator = mysqlTable(
  "authenticator",
  {
    credentialId: varchar({ length: 255 }).notNull(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: varchar({ length: 255 }).notNull(),
    credentialPublicKey: varchar({ length: 255 }).notNull(),
    counter: int().notNull(),
    credentialDeviceType: varchar({ length: 255 }).notNull(),
    credentialBackedUp: tinyint().notNull(),
    transports: varchar({ length: 255 }).default("NULL"),
  },
  (table) => [
    unique("authenticator_credentialId_unique").on(table.credentialId), // Changed credentialID to credentialId in constraint name
  ]
);

export const session = mysqlTable("session", {
  sessionToken: varchar({ length: 255 }).notNull(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp({ mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const todo = mysqlTable("todo", {
  id: varchar({ length: 255 }).notNull().primaryKey(),
  content: text().notNull(),
  completed: tinyint().default(0).notNull(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  listId: varchar({ length: 255 })
    .notNull()
    .references(() => todoList.id, { onDelete: "cascade" }),
  createdAt: timestamp({ fsp: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: timestamp({ fsp: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const todoList = mysqlTable("todo_list", {
  id: varchar({ length: 255 }).notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp({ fsp: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: timestamp({ fsp: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const user = mysqlTable(
  "user",
  {
    id: varchar({ length: 255 }).notNull().primaryKey(),
    name: varchar({ length: 255 }).default("NULL"),
    email: varchar({ length: 255 }).default("NULL"),
    emailVerified: timestamp({ fsp: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    image: varchar({ length: 255 }).default("NULL"),
    isAnonymous: tinyint("is_anonymous").default(0).notNull(),
  },
  (table) => [unique("user_email_unique").on(table.email)]
);

export const verificationtoken = mysqlTable("verificationtoken", {
  identifier: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 255 }).notNull(),
  expires: timestamp({ mode: "string" })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});
