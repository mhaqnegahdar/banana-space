import db from "@/db";
import { member } from "@/db/schema";
import { eq } from "drizzle-orm";

  export async function getLastJoinedServer(userId: string) {
  const membership = await db.query.member.findFirst({
    where: eq(member.userId, userId),
    orderBy: (member, { desc }) => [desc(member.createdAt)],
    with: {
      server: true,
    },
  });

  return membership?.server ?? null;
}