import { headers } from "next/headers";
import { auth } from "../auth";
import { NextResponse } from "next/server";

// Auth check : user is authorised or not

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return session;
}
