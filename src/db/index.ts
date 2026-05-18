import { getEnv } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";  

import * as schema from "@/db/schema"

export const client = neon(getEnv("DATABASE_URL") as string);

const db = drizzle({
  client: client,
  schema,
  // logger: true
});

export type db = typeof db;

export type client = typeof client;

export default db;
