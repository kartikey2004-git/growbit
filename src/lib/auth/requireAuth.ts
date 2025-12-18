import { headers } from "next/headers";
import { auth } from "../auth";

// Auth check : user is authorised or not

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session;
}
