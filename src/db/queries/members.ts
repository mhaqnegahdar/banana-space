import { and, eq, ne } from "drizzle-orm";
import db from "@/db";
import { member } from "../schema";

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function getMemberById(memberId: string) {
  return db.query.member.findFirst({
    where: eq(member.id, memberId),
    with: { user: true },
  });
}

// The current user's membership record in a specific server.
// Used constantly — guards, role checks, message authorship.
export async function getMemberByUserAndServer(
  userId: string,
  serverId: string,
) {
  return db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.serverId, serverId)),
    with: { user: true },
  });
}

// All members of a server with their user profiles.
// Used for the member list panel.
export async function getMembersByServerId(serverId: string) {
  return db.query.member.findMany({
    where: eq(member.serverId, serverId),
    with: { user: true },
    orderBy: (m, { asc }) => [asc(m.role), asc(m.createdAt)],
  });
}

// All OTHER members of a server — used to populate the DM "start conversation" picker.
export async function getOtherMembersByServerId(
  serverId: string,
  currentUserId: string,
) {
  return db.query.member.findMany({
    where: and(eq(member.serverId, serverId), ne(member.userId, currentUserId)),
    with: { user: true },
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

// Called when a user accepts an invite link.
export async function addMemberToServer(userId: string, serverId: string) {
  // Upsert-style: return existing row if already a member
  const existing = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.serverId, serverId)),
  });
  if (existing) return existing;

  const [newMember] = await db
    .insert(member)
    .values({
      id: crypto.randomUUID(),
      userId,
      serverId,
      role: "GUEST",
    })
    .returning();
  return newMember;
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateMemberRole(
  memberId: string,
  role: "ADMIN" | "MODERATOR" | "GUEST",
) {
  const [updated] = await db
    .update(member)
    .set({ role })
    .where(eq(member.id, memberId))
    .returning();
  return updated;
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

// Kick a member from a server (called by ADMIN/MODERATOR).
export async function kickMember(memberId: string) {
  const [deleted] = await db
    .delete(member)
    .where(eq(member.id, memberId))
    .returning();
  return deleted;
}
