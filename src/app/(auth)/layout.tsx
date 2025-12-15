import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  // we grab the session from auth.api.getSession and we have to pass headers

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if we have session means user's is currently loggedIn or authenticated , then we have redirect to home

  if (session) {
    return redirect("/");
  }

  return <div>{children}</div>;
};

export default AuthLayout;


// headers : This function allows you to read the HTTP incoming request headers in Server Components, Server Actions, Route Handlers and Middleware.

