import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { member, channel } from "./community";

export const message = pgTable(
  "message",
  {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    fileUrl: text("file_url"),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    channelId: text("channel_id")
      .notNull()
      .references(() => channel.id, { onDelete: "cascade" }),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("message_memberId_idx").on(table.memberId),
    index("message_channelId_idx").on(table.channelId),
    index("message_channelId_createdAt_idx").on(
      table.channelId,
      table.createdAt,
    ),
  ],
);

export const conversation = pgTable(
  "conversation",
  {
    id: text("id").primaryKey(),
    memberOneId: text("member_one_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    memberTwoId: text("member_two_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("conversation_memberOne_memberTwo_unique").on(
      table.memberOneId,
      table.memberTwoId,
    ),
    index("conversation_memberOneId_idx").on(table.memberOneId),
    index("conversation_memberTwoId_idx").on(table.memberTwoId),
  ],
);

export const directMessage = pgTable(
  "direct_message",
  {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    fileUrl: text("file_url"),
    memberId: text("member_id")
      .notNull()
      .references(() => member.id, { onDelete: "cascade" }),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    deleted: boolean("deleted").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("dm_memberId_idx").on(table.memberId),
    index("dm_conversationId_idx").on(table.conversationId),
    index("dm_conversationId_createdAt_idx").on(
      table.conversationId,
      table.createdAt,
    ),
  ],
);
