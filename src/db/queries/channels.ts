import { and, eq } from "drizzle-orm";
import db from "@/db";
import { channel } from "../schema";

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function getChannelById(channelId: string) {
  return db.query.channel.findFirst({
    where: eq(channel.id, channelId),
    with: { server: true },
  });
}

export async function getChannelsByServerId(serverId: string) {
  return db.query.channel.findMany({
    where: eq(channel.serverId, serverId),
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });
}

// First text channel in a server — used as the default landing channel.
export async function getDefaultChannel(serverId: string) {
  return db.query.channel.findFirst({
    where: and(eq(channel.serverId, serverId), eq(channel.type, "TEXT")),
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createChannel(data: {
  id: string;
  name: string;
  type: "TEXT" | "AUDIO" | "VIDEO";
  serverId: string;
  createdById?: string;
}) {
  const [newChannel] = await db.insert(channel).values(data).returning();
  return newChannel;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateChannel(
  channelId: string,
  serverId: string,
  data: { name?: string; type?: "TEXT" | "AUDIO" | "VIDEO" },
) {
  const [updated] = await db
    .update(channel)
    .set(data)
    .where(and(eq(channel.id, channelId), eq(channel.serverId, serverId)))
    .returning();
  return updated;
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function deleteChannel(channelId: string, serverId: string) {
  const [deleted] = await db
    .delete(channel)
    .where(and(eq(channel.id, channelId), eq(channel.serverId, serverId)))
    .returning();
  return deleted;
}
