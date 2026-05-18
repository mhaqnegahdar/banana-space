import { and, eq, lt, or } from "drizzle-orm";
import db from "@/db";
import { conversation, directMessage } from "../schema";

const MESSAGES_BATCH = 10;

// ─────────────────────────────────────────────
// CONVERSATIONS
// ─────────────────────────────────────────────

export async function getConversationById(conversationId: string) {
  return db.query.conversation.findFirst({
    where: eq(conversation.id, conversationId),
    with: {
      memberOne: { with: { user: true } },
      memberTwo: { with: { user: true } },
    },
  });
}

// Find an existing conversation between two members, regardless of
// which is memberOne vs memberTwo (the schema always stores the
// lower-sorted id first, but this query is symmetrical to be safe).
export async function getConversationByMembers(
  memberOneId: string,
  memberTwoId: string,
) {
  return db.query.conversation.findFirst({
    where: or(
      and(
        eq(conversation.memberOneId, memberOneId),
        eq(conversation.memberTwoId, memberTwoId),
      ),
      and(
        eq(conversation.memberOneId, memberTwoId),
        eq(conversation.memberTwoId, memberOneId),
      ),
    ),
    with: {
      memberOne: { with: { user: true } },
      memberTwo: { with: { user: true } },
    },
  });
}

// Find or create a 1-to-1 conversation between two members.
// Always store the lexicographically smaller id as memberOne
// so the unique index is never violated.
export async function findOrCreateConversation(
  memberAId: string,
  memberBId: string,
) {
  const existing = await getConversationByMembers(memberAId, memberBId);
  if (existing) return existing;

  const [memberOneId, memberTwoId] = [memberAId, memberBId].sort();

  const [newConversation] = await db
    .insert(conversation)
    .values({
      id: crypto.randomUUID(),
      memberOneId,
      memberTwoId,
    })
    .returning();

  return getConversationById(newConversation.id);
}

// ─────────────────────────────────────────────
// DIRECT MESSAGES
// ─────────────────────────────────────────────

export async function getDirectMessageById(directMessageId: string) {
  return db.query.directMessage.findFirst({
    where: eq(directMessage.id, directMessageId),
    with: {
      member: { with: { user: true } },
    },
  });
}

// Paginated DMs for a conversation — mirrors the channel message pattern.
export async function getDirectMessagesByConversationId(
  conversationId: string,
  cursor?: Date,
) {
  return db.query.directMessage.findMany({
    where: cursor
      ? and(
          eq(directMessage.conversationId, conversationId),
          lt(directMessage.createdAt, cursor),
        )
      : eq(directMessage.conversationId, conversationId),
    with: {
      member: { with: { user: true } },
    },
    orderBy: (dm, { desc }) => [desc(dm.createdAt)],
    limit: MESSAGES_BATCH,
  });
}

export async function createDirectMessage(data: {
  id: string;
  content: string;
  fileUrl?: string;
  memberId: string;
  conversationId: string;
}) {
  const [newDm] = await db.insert(directMessage).values(data).returning();
  return getDirectMessageById(newDm.id);
}

// Only the author can edit.
export async function updateDirectMessage(
  directMessageId: string,
  memberId: string,
  content: string,
) {
  const [updated] = await db
    .update(directMessage)
    .set({ content })
    .where(
      and(
        eq(directMessage.id, directMessageId),
        eq(directMessage.memberId, memberId),
      ),
    )
    .returning();
  return updated;
}

// Soft delete — same pattern as channel messages.
export async function softDeleteDirectMessage(
  directMessageId: string,
  memberId?: string,
) {
  const condition = memberId
    ? and(
        eq(directMessage.id, directMessageId),
        eq(directMessage.memberId, memberId),
      )
    : eq(directMessage.id, directMessageId);

  const [deleted] = await db
    .update(directMessage)
    .set({ deleted: true, content: "This message has been deleted." })
    .where(condition)
    .returning();
  return deleted;
}
