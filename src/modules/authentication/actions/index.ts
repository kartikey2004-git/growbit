"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/database";
import { headers } from "next/headers";

export const currentUser = async () => {
  try {
    // we grab the session from auth.api.getSession and we have to pass headers

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // these headers contains information about related to cookies which are internally implemented by better-auth

    // grab the current loggedIn user id from session

    if (!session?.user.id) {
      return null;
    }

    // Find the unique user in database on basis of unique ID

    const user = db.user.findUnique({
      where: {
        id: session.user.id,
      },

      // extract all this information about the user and then return the user

      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
};
