import { getLastJoinedServer } from "@/modules/modals/actions/get-last-joined-server";
import { redirect } from "next/navigation";
import { InitialModal } from "@/modules/modals/components/setup-modal";
import { requireAuth } from "@/lib/route-helpers";

export default async function SetupPage() {
  const { profile, response } = await requireAuth();

  if (response) {
    redirect(`/login`);
  }

  const server = await getLastJoinedServer(profile.id);

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
