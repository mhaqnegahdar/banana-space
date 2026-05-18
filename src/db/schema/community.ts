import {
  pgTable,
  text,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { memberRoleEnum, channelTypeEnum } from "./enums";

export const server = pgTable(
  "server",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    inviteCode: text("invite_code").notNull().unique(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("server_ownerId_idx").on(table.ownerId)],
);

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    role: memberRoleEnum("role").default("GUEST").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    serverId: text("server_id")
      .notNull()
      .references(() => server.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("member_userId_idx").on(table.userId),
    index("member_serverId_idx").on(table.serverId),
    uniqueIndex("member_userId_serverId_unique").on(
      table.userId,
      table.serverId,
    ),
  ],
);

export const channel = pgTable(
  "channel",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: channelTypeEnum("type").default("TEXT").notNull(),
    serverId: text("server_id")
      .notNull()
      .references(() => server.id, { onDelete: "cascade" }),
    createdById: text("created_by_id").references(() => member.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("channel_serverId_idx").on(table.serverId)],
);
