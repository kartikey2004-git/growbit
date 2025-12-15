// This imports the PrismaClient class from Prisma's generated client. This class is what you'll use to talk to your database (run queries, migrations, etc).

import { PrismaClient } from "@prisma/client";

// Tell TypeScript that `prisma` variable may exist on the global object

declare global {
  var prisma: PrismaClient | undefined;
}

const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // enable logging
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;

/*
  
  - We use Prisma instance to query the database
     
     - NextJS uses hot reloading : whenever we save something inside the app , it gonna create new prisma client every single time and we don't want to do that

     - In Next.js development mode (when we save a file), it hot-reloads our code multiple times.

     - If there's a new PrismaClient() every time, we'll end up with many database connections open (which will eventually crash Neon/Postgres).
     
     - connections overloading in connection.pool

     -  I don't want to crash your database due to multiple Prisma clients.

-----------------------------------------------

    - In development mode setting up globalThis.prisma only

    - Because on Hot-Reloading , to avoid problem of creating multiple new connections

    - There is no need in production , because only one time client intialise in production.


-----------------------------------------------

    
    - By attaching Prisma to globalThis, you ensure only one instance is reused across reloads.

    - globalThis.prisma: This global variable ensures that the Prisma client instance is reused across hot reloads during development.


    - Without this, each time your application reloads, a new instance of the Prisma client would be created, potentially leading to connection issues.


-----------------------------------------------

    
    - In development (NODE_ENV !== "production"):  
       
        - It assigns the db instance to globalThis.prisma.

        - So on the next reload, Prisma will reuse the same instance 
    
    - In production :
       
        - It does not attach Prisma to globalThis. This is because production runs once per request (no hot reload), so creating fresh instances is fine.

  
Follows best practices for both dev (reusing the client) and prod (creating per-deploy safe clients).

*/
