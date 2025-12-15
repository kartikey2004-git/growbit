// Create A Better Auth Instance

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; // prisma ORM adapter

import db from "./database"; // prisma client which talks to database like run queries, migrations etc.

import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
});

/* 

In prisma + better auth, if we want to implement oAuth using google or github provider
  
  - if we run that commands that provided , automatically all authenticated related prisma schema models added automatically

- We support google as well as github provider

*/