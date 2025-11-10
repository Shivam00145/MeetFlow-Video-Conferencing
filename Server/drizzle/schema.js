import { relations } from "drizzle-orm";
import { 
    mysqlTable,
    int,
    timestamp,
    varchar,
    boolean,
    text, } from "drizzle-orm/mysql-core";


export const Users = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    isAdmin: boolean().default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})


export const Sessions = mysqlTable("sessions", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => Users.id, { onDelete: "cascade" }),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const ContactMessage = mysqlTable("contact-messages", {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => Users.id, { onDelete: "cascade" }),
    message: varchar({length: 300}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})


export const History = mysqlTable("history", {
    id: int().autoincrement().primaryKey(),
    userId: int("user_id").notNull().references(() => Users.id, { onDelete: "cascade" }),
    meetingCode : varchar({ length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const usersRelation = relations(Users, ({ many }) => ({
    session : many(Sessions),
    contact : many(ContactMessage),
    history : many(History),
}))

export const sessionsRelation = relations(Sessions, ({ one }) => ({
    user : one(Users, {
        fields: [Sessions.userId],
        references: [Users.id]
    })
}))

export const ContactRelation = relations(ContactMessage, ({ one }) => ({
    user: one(Users, {
        fields: [ContactMessage.userId],
        references: [Users.id]
    })
}))

export const HistoryRelation = relations(History, ({ one }) => ({
    user: one(Users, {
        fields: [History.userId],
        references: [Users.id]
    })
}))