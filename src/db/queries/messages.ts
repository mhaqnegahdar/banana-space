import { and, eq, lt, desc } from "drizzle-orm";
import db from "@/db";
import { message } from "../schema";

// Messages are cursor-paginated (newest-first).
// Each page returns MESSAGES_BATCH rows; pass the last message's
// createdAt as `cursor` to fetch the next page.
const MESSAGES_BATCH = 10;

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function getMessageById(messageId: string) {
  return db.query.message.findFirst({
    where: eq(message.id, messageId),
    with: {
      member: { with: { user: true } },
    },
  });
}

// Paginated channel messages — newest first, cursor-based.
// Pass `cursor` (a Date) to get the page before that timestamp.
export async function getMessagesByChannelId(channelId: string, cursor?: Date) {
  return db.query.message.findMany({
    where: cursor
      ? and(eq(message.channelId, channelId), lt(message.createdAt, cursor))
      : eq(message.channelId, channelId),
    with: {
      member: { with: { user: true } },
    },
    orderBy: (m, { desc }) => [desc(m.createdAt)],
    limit: MESSAGES_BATCH,
  });
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createMessage(data: {
  id: string;
  content: string;
  fileUrl?: string;
  memberId: string;
  channelId: string;
}) {
  const [newMessage] = await db.insert(message).values(data).returning();
  // Return with member + user so the socket can broadcast rich data
  return getMessageById(newMessage.id);
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

// Only the author can edit a message.
export async function updateMessage(
  messageId: string,
  memberId: string,
  content: string,
) {
  const [updated] = await db
    .update(message)
    .set({ content })
    .where(and(eq(message.id, messageId), eq(message.memberId, memberId)))
    .returning();
  return updated;
}

// ─────────────────────────────────────────────
// DELETE (soft)
// ─────────────────────────────────────────────

// Authors can soft-delete their own messages.
// ADMINs/MODERATORs call this without the memberId check
// (enforce that guard in the route handler instead).
export async function softDeleteMessage(messageId: string, memberId?: string) {
  const condition = memberId
    ? and(eq(message.id, messageId), eq(message.memberId, memberId))
    : eq(message.id, messageId);

  const [deleted] = await db
    .update(message)
    .set({ deleted: true, content: "This message has been deleted." })
    .where(condition)
    .returning();
  return deleted;
}
