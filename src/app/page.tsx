import { SignOutButton } from "@/components/layout/signout-button";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="">
      {session.user.name}
      {session.user.email}
      {session.user.image}
      Coming Soon....
      <SignOutButton />
    </div>
  );
}
