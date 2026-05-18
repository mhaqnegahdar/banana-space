import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/route-helpers";
import { createServer } from "@/db/queries";
import { createServerSchema } from "@/modules/setup/lib/schema";

// POST /api/servers
// Body: { name: string; imageUrl: string }
export async function POST(req: Request) {
  const { user, response } = await requireAuth();
  if (response) return response;

  const body = await req.json();
  const validated = createServerSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      { error: validated.error.message },
      { status: 400 },
    );
  }

  const server = await createServer({
    id: crypto.randomUUID(),
    name: validated.data.name,
    imageUrl: validated.data.imageUrl,
    inviteCode: crypto.randomUUID(),
    ownerId: user!.id,
  });

  return NextResponse.json(server, { status: 201 });
}
