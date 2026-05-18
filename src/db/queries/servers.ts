import { and, eq, ne } from "drizzle-orm";
import db from "@/db";
import { server, member, channel } from "../schema";

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

// Full server detail: members (with user profiles) + channels.
// Used when rendering the server sidebar.
export async function getServerById(serverId: string) {
  return db.query.server.findFirst({
    where: eq(server.id, serverId),
    with: {
      channels: {
        orderBy: (channels, { asc }) => [asc(channels.createdAt)],
      },
      members: {
        with: { user: true },
        orderBy: (members, { asc }) => [asc(members.role)],
      },
    },
  });
}

// Lightweight check — just the server row. Used in middleware / guards.
export async function getServerByIdLight(serverId: string) {
  return db.query.server.findFirst({
    where: eq(server.id, serverId),
  });
}

// Resolve an invite link before the join flow.
export async function getServerByInviteCode(inviteCode: string) {
  return db.query.server.findFirst({
    where: eq(server.inviteCode, inviteCode),
  });
}

// All servers a specific user belongs to (for the left-rail list).
export async function getServersByUserId(userId: string) {
  return db.query.server.findMany({
    where: (s, { exists }) =>
      exists(
        db
          .select()
          .from(member)
          .where(and(eq(member.serverId, s.id), eq(member.userId, userId))),
      ),
    orderBy: (s, { asc }) => [asc(s.createdAt)],
  });
}

// The first server a user belongs to — used as the default redirect
// after login when no specific server is in the URL.
export async function getFirstServerByUserId(userId: string) {
  const membership = await db.query.member.findFirst({
    where: eq(member.userId, userId),
    with: { server: true },
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });
  return membership?.server ?? null;
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createServer(data: {
  id: string;
  name: string;
  imageUrl: string;
  inviteCode: string;
  ownerId: string;
}) {
  // 1. Insert the server
  const [newServer] = await db.insert(server).values(data).returning();

  // 2. Add the owner as ADMIN member
  await db.insert(member).values({
    id: crypto.randomUUID(),
    serverId: newServer.id,
    userId: data.ownerId,
    role: "ADMIN",
  });

  // 3. Create default "general" channel
  await db.insert(channel).values({
    id: crypto.randomUUID(),
    name: "general",
    type: "TEXT",
    serverId: newServer.id,
  });

  return newServer;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateServer(
  serverId: string,
  ownerId: string,
  data: { name?: string; imageUrl?: string },
) {
  const [updated] = await db
    .update(server)
    .set(data)
    .where(and(eq(server.id, serverId), eq(server.ownerId, ownerId)))
    .returning();
  return updated;
}

export async function regenerateInviteCode(
  serverId: string,
  ownerId: string,
  newCode: string,
) {
  const [updated] = await db
    .update(server)
    .set({ inviteCode: newCode })
    .where(and(eq(server.id, serverId), eq(server.ownerId, ownerId)))
    .returning();
  return updated;
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

// Only the owner can delete the server (cascade handles everything else).
export async function deleteServer(serverId: string, ownerId: string) {
  const [deleted] = await db
    .delete(server)
    .where(and(eq(server.id, serverId), eq(server.ownerId, ownerId)))
    .returning();
  return deleted;
}

// Member leaving a server (not the owner).
export async function leaveServer(serverId: string, userId: string) {
  const [deleted] = await db
    .delete(member)
    .where(and(eq(member.serverId, serverId), eq(member.userId, userId)))
    .returning();
  return deleted;
}
