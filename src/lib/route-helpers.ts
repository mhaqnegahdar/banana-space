import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorised" }, { status: 401 }),
    };
  }

  return { profile: session.user, response: null };
}