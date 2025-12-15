// for production ready apps , we can made our environment variables type safe

// implement zod schema validation on environment variables

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/*

We have two types of environment variables
  
  - client environment variables like NEXT_AUTH_PUBLIC_URL , FRONTEND_URL , BACKEND_URL : which are publically available krwa skte hai

  - but client secrets , database URL's ye publically available nhi krwa skte hai only to reveal only on server side for top-notch security

*/

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
