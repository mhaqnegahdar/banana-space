import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { server, member, channel } from "./community";
import { message, conversation, directMessage } from "./messaging";

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  servers: many(server),
  members: many(member),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

// ─────────────────────────────────────────────
// COMMUNITY
// ─────────────────────────────────────────────

export const serverRelations = relations(server, ({ one, many }) => ({
  owner: one(user, { fields: [server.ownerId], references: [user.id] }),
  members: many(member),
  channels: many(channel),
}));

export const memberRelations = relations(member, ({ one, many }) => ({
  user: one(user, { fields: [member.userId], references: [user.id] }),
  server: one(server, { fields: [member.serverId], references: [server.id] }),
  messages: many(message),
  directMessages: many(directMessage),
  conversationsInitiated: many(conversation, { relationName: "memberOne" }),
  conversationsReceived: many(conversation, { relationName: "memberTwo" }),
}));

export const channelRelations = relations(channel, ({ one, many }) => ({
  server: one(server, { fields: [channel.serverId], references: [server.id] }),
  createdBy: one(member, {
    fields: [channel.createdById],
    references: [member.id],
  }),
  messages: many(message),
}));

// ─────────────────────────────────────────────
// MESSAGING
// ─────────────────────────────────────────────

export const messageRelations = relations(message, ({ one }) => ({
  member: one(member, { fields: [message.memberId], references: [member.id] }),
  channel: one(channel, {
    fields: [message.channelId],
    references: [channel.id],
  }),
}));

export const conversationRelations = relations(conversation, ({ one, many }) => ({
  memberOne: one(member, {
    fields: [conversation.memberOneId],
    references: [member.id],
    relationName: "memberOne",
  }),
  memberTwo: one(member, {
    fields: [conversation.memberTwoId],
    references: [member.id],
    relationName: "memberTwo",
  }),
  directMessages: many(directMessage),
}));

export const directMessageRelations = relations(directMessage, ({ one }) => ({
  member: one(member, {
    fields: [directMessage.memberId],
    references: [member.id],
  }),
  conversation: one(conversation, {
    fields: [directMessage.conversationId],
    references: [conversation.id],
  }),
}));
