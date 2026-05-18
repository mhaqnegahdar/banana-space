import { getLastJoinedServer } from "@/modules/setup/actions/get-last-joined-server";
import { redirect } from "next/navigation";
import {InitialModal} from "@/modules/setup/ui/components/initial-modal";
import { requireAuth } from "@/lib/route-helpers";

export default async function SetupPage() {
  const {user, response} = await requireAuth();

  if (response) {
    redirect(`/login`);
  }

  const server = await getLastJoinedServer(user.id);

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return <InitialModal />;
}
