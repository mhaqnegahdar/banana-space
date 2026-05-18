import { pgEnum } from "drizzle-orm/pg-core";

export const memberRoleEnum = pgEnum("member_role", [
  "ADMIN",
  "MODERATOR",
  "GUEST",
]);

export const channelTypeEnum = pgEnum("channel_type", [
  "TEXT",
  "AUDIO",
  "VIDEO",
]);
