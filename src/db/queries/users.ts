import { eq } from "drizzle-orm";
import db from "@/db";
import { user } from "../schema";

// ─────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────

export async function getUserById(id: string) {
  return db.query.user.findFirst({
    where: eq(user.id, id),
  });
}

export async function getUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

export async function getUserByUsername(username: string) {
  return db.query.user.findFirst({
    where: eq(user.username, username),
  });
}

// Fetch a user together with all their server memberships.
// Used on initial app load to build the sidebar.
export async function getUserWithServers(userId: string) {
  return db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      members: {
        with: {
          server: true,
        },
      },
    },
  });
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateUserProfile(
  userId: string,
  data: { name?: string; image?: string; username?: string },
) {
  const [updated] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
    .returning();
  return updated;
}
