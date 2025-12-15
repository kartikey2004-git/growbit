import { createAuthClient } from "better-auth/react"; //function that helps us create an authentication client

import { env } from "./env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL, // Backend server address
});

/*

  - Create an instance of the auth client with a baseURL pointing to our backend API

  - This tells the client where to send authentication requests (sign-in, sign-up, etc.)

  - main auth functions (signIn, signUp, useSession) : functions will be used in React components to handle authentication

----------------------------------------------

  - This client will communicate with the better-auth backend server to manage user authentication and sessions in our app

  - authClient is the instance that carries config (like baseURL).

  - useSession → React hook to check if a user is logged in (and get their session info).


*/

